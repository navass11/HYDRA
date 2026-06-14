#!/usr/bin/env python3
"""Smoke-test effective HEC-HMS calibration plumbing.

The test uses a temporary writable copy of the Tifton HEC-HMS sample, restores
the complete historical gage DSS from the official HEC-HMS samples archive when
needed, then verifies that editing SMA/Clark parameters changes the simulated
hydrograph. Optionally, it runs a short SCE-UA calibration against the bundled
demo comparison series. That optional target validates the machinery only; it
is not an independent scientific calibration dataset.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import tempfile
import zipfile
from pathlib import Path

import numpy as np
import pandas as pd
import spotpy

from pyhydra.modeling.hydrology.hec_hms import (
    generate_control,
    generate_met_freq_storm,
    generate_run,
    read_basin,
    read_control,
    read_dss6_timeseries,
    read_subbasin,
    run_hms_script,
    update_basin_file,
)


CAL_PARAMS = [
    ("max_infil_mult", 0.50, 1.80),
    ("soil_storage_mult", 0.50, 1.80),
    ("soil_tension_mult", 0.50, 1.80),
    ("tc_mult", 0.60, 1.60),
    ("storage_coeff_mult", 0.60, 1.60),
    ("gw1_route_mult", 0.50, 2.00),
]

PARAMETER_MAP = {
    "max_infil": "Soil Maximum Infiltration",
    "soil_storage": "Soil Storage Capacity",
    "soil_tension": "Soil Tension Capacity",
    "tc": "Time of Concentration",
    "storage_coeff": "Storage Coefficient",
    "gw1_route": "Groundwater 1 Routing Coefficient",
}


def _truthy(value: str | None) -> bool:
    return (value or "").strip().lower() in {"1", "true", "yes"}


def _read_hms_keyword_value(basin_path: Path, subbasin: str, keyword: str) -> float:
    text = basin_path.read_text()
    pattern = rf"Subbasin:\s+{re.escape(str(subbasin))}.*?^\s+{re.escape(keyword)}:\s*([\d.\-]+)"
    match = re.search(pattern, text, flags=re.MULTILINE | re.DOTALL)
    if not match:
        raise ValueError(f"Keyword {keyword!r} not found for subbasin {subbasin!r}")
    return float(match.group(1))


def restore_complete_tifton_dss(work_model: Path, source_model: Path, samples_zip: Path) -> int:
    """Restore complete Tifton gage DSS when the source copy is truncated."""
    dss_path = work_model / "tifton.dss"
    before = dss_path.stat().st_size if dss_path.exists() else 0
    if before >= 1_000_000:
        return before
    if not samples_zip.exists():
        raise FileNotFoundError(f"Complete tifton.dss is missing and samples.zip was not found: {samples_zip}")
    with zipfile.ZipFile(samples_zip) as zf:
        with zf.open("samples/samples/tifton/tifton.dss") as src, dss_path.open("wb") as dst:
            shutil.copyfileobj(src, dst)
    return dss_path.stat().st_size


class CalibratableTifton:
    def __init__(self, path_model: Path, hms_dir: Path, name_run: str, output_prefix: str):
        self.path_model = path_model
        self.hms_dir = hms_dir
        self.name_model = "tifton"
        self.name_run = name_run
        self.output_prefix = output_prefix
        self.name_basin = read_basin(str(path_model), "Tifton.basin")[0]
        self.name_control = read_control(str(path_model), "tifton.hms")[0]
        self.subbasin = read_subbasin(str(path_model), "Tifton.basin")[0]
        self.basin_path = path_model / f"{self.name_basin}.basin"
        self.baseline = {
            key: _read_hms_keyword_value(self.basin_path, self.subbasin, keyword)
            for key, keyword in PARAMETER_MAP.items()
        }

    def _write_params(self, params: np.ndarray) -> None:
        if len(params) != len(CAL_PARAMS):
            raise ValueError(f"Expected {len(CAL_PARAMS)} parameters, received {len(params)}")
        soil_storage = self.baseline["soil_storage"] * float(params[1])
        soil_tension = min(
            self.baseline["soil_tension"] * float(params[2]),
            0.95 * soil_storage,
        )
        values = {
            "max_infil": self.baseline["max_infil"] * float(params[0]),
            "soil_storage": soil_storage,
            "soil_tension": max(0.001, soil_tension),
            "tc": self.baseline["tc"] * float(params[3]),
            "storage_coeff": self.baseline["storage_coeff"] * float(params[4]),
            "gw1_route": self.baseline["gw1_route"] * float(params[5]),
        }
        df = pd.DataFrame([values], index=[self.subbasin])
        update_basin_file(str(self.basin_path), df, PARAMETER_MAP)

    def run(self, params: np.ndarray) -> pd.Series:
        self._write_params(params)
        ret = run_hms_script(
            str(self.path_model),
            self.name_model,
            [self.name_run],
            hms_dir=str(self.hms_dir),
            strict_logs=True,
        )
        if ret != 0:
            raise RuntimeError(f"HEC-HMS failed or aborted internally; return code {ret}")
        dss_path = self.path_model / f"{self.name_run.replace(' ', '_')}.dss"
        if not dss_path.exists():
            dss_path = self.path_model / f"{self.name_run}.dss"
        try:
            from hecdss import HecDss

            with HecDss(str(dss_path)) as dss:
                catalog = dss.get_catalog()
                run_key = f"/RUN:{self.name_run}/".upper()
                prefix = (self.output_prefix.rstrip("/") + "/").upper()
                paths = [
                    p for p in catalog.uncondensed_paths
                    if p.upper().startswith(prefix) and run_key in p.upper()
                ]
                if paths:
                    ts = dss.get(sorted(paths)[-1])
                    return pd.Series(
                        np.asarray(ts.get_values(), dtype=float) * 0.028316846592,
                        index=pd.to_datetime(ts.get_dates()),
                        name="sim_m3s",
                    ).resample("D").mean().dropna()
        except Exception:
            pass

        df = read_dss6_timeseries(str(dss_path), self.output_prefix, n_months=6, latest=True)
        if df.empty:
            raise RuntimeError(f"No simulated flow found in {dss_path}")
        return pd.Series(
            df["value"].to_numpy(dtype=float) * 0.028316846592,
            index=pd.to_datetime(df["datetime"]),
            name="sim_m3s",
        ).resample("D").mean().dropna()


def _align(sim: pd.Series, obs: pd.Series) -> tuple[np.ndarray, np.ndarray]:
    if not isinstance(sim, pd.Series) or not isinstance(obs, pd.Series):
        sim_arr = np.asarray(sim, dtype=float)
        obs_arr = np.asarray(obs, dtype=float)
        n = min(len(sim_arr), len(obs_arr))
        return sim_arr[:n], obs_arr[:n]
    idx = sim.dropna().index.intersection(obs.dropna().index)
    if len(idx) == 0:
        n = min(len(sim), len(obs))
        return sim.iloc[:n].to_numpy(), obs.iloc[:n].to_numpy()
    return sim.loc[idx].to_numpy(), obs.loc[idx].to_numpy()


class SpotpySetup:
    def __init__(self, model: CalibratableTifton, obs: pd.Series):
        self.model = model
        self.obs = obs
        self.params = [spotpy.parameter.Uniform(name, lo, hi) for name, lo, hi in CAL_PARAMS]

    def parameters(self):
        return spotpy.parameter.generate(self.params)

    def simulation(self, vector):
        return self.model.run(np.asarray(vector, dtype=float)).values

    def evaluation(self):
        return self.obs.values

    def objectivefunction(self, simulation, evaluation):
        sim, obs = _align(simulation, evaluation)
        if len(sim) == 0:
            return np.inf
        return -spotpy.objectivefunctions.nashsutcliffe(obs, sim)


def configure_idf_calibration_run(work_model: Path, model: CalibratableTifton) -> None:
    """Create a deterministic IDF event run for calibration smoke testing."""
    idf_ref = pd.DataFrame(
        {
            model.subbasin: [67, 89, 115, 133, 168, 217, 282],
        },
        index=[0.5, 1, 2, 3, 6, 12, 24],
    )
    generate_control(
        name_model=model.name_model,
        path_model=str(work_model),
        name_control="CAL_IDF_Control",
        start_time="1 January 2000, 00:00",
        end_time="3 January 2000, 00:00",
        time_interval="60",
    )
    generate_met_freq_storm(
        name_met="CAL_IDF_T25",
        names_sbasin=[model.subbasin],
        path_model=str(work_model),
        idf=idf_ref,
        name_basin=model.name_basin,
        basin_area_km2=19.3,
    )
    generate_run(
        path_model=str(work_model),
        name_model=model.name_model,
        name_run=model.name_run,
        name_met="CAL_IDF_T25",
        name_basin=model.name_basin,
        name_control="CAL_IDF_Control",
        exists_run=True,
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-model", type=Path, default=Path("/workspace/data/hms/Tifton"))
    parser.add_argument("--hms-dir", type=Path, default=Path(os.environ.get("HEC_HMS_DIR", "/workspace/data/hms/HEC-HMS-4.13")))
    parser.add_argument("--samples-zip", type=Path, default=None)
    parser.add_argument("--evals", type=int, default=int(os.environ.get("HYDRA_HMS_CALIBRATION_EVALS", "0")))
    parser.add_argument("--mode", choices=["idf", "historical"], default=os.environ.get("HYDRA_HMS_CALIBRATION_SMOKE_MODE", "idf"))
    parser.add_argument("--work-dir", type=Path, default=None)
    args = parser.parse_args()

    source_model = args.source_model
    if not source_model.exists():
        source_model = Path.cwd() / "data" / "hms" / "Tifton"
    samples_zip = args.samples_zip or source_model.parent / "HEC-HMS-4.13" / "samples.zip"

    with tempfile.TemporaryDirectory(prefix="hydra-hms-cal-", dir=str(args.work_dir) if args.work_dir else None) as tmp:
        work_model = Path(tmp) / "Tifton"
        shutil.copytree(source_model, work_model)
        dss_size = restore_complete_tifton_dss(work_model, source_model, samples_zip)

        if args.mode == "historical":
            model = CalibratableTifton(work_model, args.hms_dir, "1970 simulation", "//STATION I/FLOW")
        else:
            model = CalibratableTifton(work_model, args.hms_dir, "T25", "//74006/FLOW")

        baseline = np.ones(len(CAL_PARAMS), dtype=float)
        perturbed = np.array([lo if i % 2 == 0 else hi for i, (_, lo, hi) in enumerate(CAL_PARAMS)], dtype=float)
        q0 = model.run(baseline)
        q1 = model.run(perturbed)
        idx = q0.index.intersection(q1.index)
        max_delta = float(np.nanmax(np.abs(q0.loc[idx].values - q1.loc[idx].values)))
        if not np.isfinite(max_delta) or max_delta < 1e-5:
            raise RuntimeError("Parameter perturbation did not change the HMS hydrograph.")

        summary = {
            "work_model": str(work_model),
            "mode": args.mode,
            "dss_size": dss_size,
            "baseline_peak_m3s": float(q0.max()),
            "perturbed_peak_m3s": float(q1.max()),
            "max_delta_m3s": max_delta,
        }

        if args.evals > 0:
            if args.mode == "historical":
                obs_csv = work_model / "obs_flow_74006.csv"
                if not obs_csv.exists():
                    raise FileNotFoundError(f"Demo comparison series not found: {obs_csv}")
                obs = pd.read_csv(obs_csv, parse_dates=["datetime"], index_col="datetime")["Q_obs_m3s"].resample("D").mean().dropna()
            else:
                target_params = np.array([1.35, 0.75, 1.20, 1.25, 0.80, 1.10], dtype=float)
                obs = model.run(target_params)
                model.run(baseline)
            dbname = str(work_model / "SCEUA_smoke")
            sampler = spotpy.algorithms.sceua(SpotpySetup(model, obs), dbname=dbname, dbformat="csv")
            sampler.sample(args.evals, ngs=len(CAL_PARAMS) + 1)
            df = pd.read_csv(dbname + ".csv")
            best = df.loc[df["like1"].idxmin()]
            summary["sceua_evals"] = args.evals
            summary["best_objective_neg_nse"] = float(best["like1"])
            summary["best_nse"] = float(-best["like1"])

        print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
