import json
from pathlib import Path

def modify_nb_4():
    nb_path = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA/notebooks/pilot_cases/los_corrales_buelna/04_design_storm_hms.ipynb")
    with open(nb_path, "r", encoding="utf-8") as f:
        nb = json.load(f)
    modified = False
    for cell in nb["cells"]:
        if cell["cell_type"] == "code":
            source = "".join(cell["source"])
            if "pathname_prefix='//OUTLET/FLOW'" in source:
                source = source.replace("pathname_prefix='//OUTLET/FLOW'", "pathname_prefix='//REACH-5/FLOW'")
                cell["source"] = [s + "\n" for s in source.splitlines()]
                if cell["source"] and not source.endswith("\n"):
                    cell["source"][-1] = cell["source"][-1].rstrip("\n")
                modified = True
                print("Modified 04_design_storm_hms.ipynb")
    if modified:
        with open(nb_path, "w", encoding="utf-8") as f:
            json.dump(nb, f, indent=1, ensure_ascii=False)
            f.write("\n") # Add trailing newline

def modify_nb_5():
    nb_path = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA/notebooks/pilot_cases/los_corrales_buelna/05_continuous_simulation.ipynb")
    with open(nb_path, "r", encoding="utf-8") as f:
        nb = json.load(f)
    modified = False
    
    # We will search and perform edits in cells
    cells_to_insert = []
    
    for cell_idx, cell in enumerate(nb["cells"]):
        if cell["cell_type"] == "code":
            source = "".join(cell["source"])
            
            # Replacement 1: Date parser in Q_sim loading
            if "Los_Corrales_IDW.csv" in source and "replace(year=d.year + 100)" in source:
                old_part = """        _df_idw = pd.read_csv(_idw_csv, index_col=0)
        _df_idw.index = pd.to_datetime(_df_idw.index, dayfirst=True)
        _df_idw.index = _df_idw.index.map(
            lambda d: d.replace(year=d.year + 100) if d.year < 1970 else d
        )"""
                new_part = """        import re
        def _parse_mixed_date(dt_str):
            months_map = {
                'ene': 'Jan', 'feb': 'Feb', 'mar': 'Mar', 'abr': 'Apr', 'may': 'May', 'jun': 'Jun',
                'jul': 'Jul', 'ago': 'Aug', 'sep': 'Sep', 'oct': 'Oct', 'nov': 'Nov', 'dic': 'Dec'
            }
            dt_str = str(dt_str).strip().lower()
            for es, en in months_map.items():
                if es in dt_str:
                    dt_str = dt_str.replace(es, '-' + en + '-')
                    break
            dt_str = re.sub(r'-+', '-', dt_str).strip('-')
            parts = dt_str.split('-')
            if len(parts) == 3:
                day, month, year = parts
                if len(year) == 2:
                    yr = int(year)
                    if yr >= 70:
                        year = '19' + year
                    else:
                        year = '20' + year
                return pd.to_datetime(f'{day}-{month}-{year}', format='%d-%b-%Y')
            return pd.to_datetime(dt_str)

        _df_idw = pd.read_csv(_idw_csv, index_col=0)
        _df_idw.index = pd.DatetimeIndex([_parse_mixed_date(x) for x in _df_idw.index])"""
                
                source_norm = source.replace("\r\n", "\n")
                old_norm = old_part.replace("\r\n", "\n")
                new_norm = new_part.replace("\r\n", "\n")
                if old_norm in source_norm:
                    source_norm = source_norm.replace(old_norm, new_norm)
                    cell["source"] = [s + "\n" for s in source_norm.splitlines()]
                    if cell["source"] and not source_norm.endswith("\n"):
                        cell["source"][-1] = cell["source"][-1].rstrip("\n")
                    modified = True
                    print("Modified 05_continuous_simulation.ipynb date parser")

            # Replacement 2: Diagnostic metrics cell (adding monthly calibration)
            if "def nse(obs, sim):" in source and "diagnostics_df = pd.DataFrame({" in source and "interpreted_as_calibration" in source:
                old_metrics_block = """def nse(obs, sim):
    \"\"\"Nash-Sutcliffe Efficiency.\"\"\"
    mask = ~(np.isnan(obs) | np.isnan(sim))
    o, s = obs[mask], sim[mask]
    return 1 - np.sum((o - s)**2) / np.sum((o - o.mean())**2)

def kge(obs, sim):
    \"\"\"Kling-Gupta Efficiency.\"\"\"
    mask = ~(np.isnan(obs) | np.isnan(sim))
    o, s = obs[mask], sim[mask]
    r  = np.corrcoef(o, s)[0, 1]
    alpha = s.std()  / o.std()
    beta  = s.mean() / o.mean()
    return 1 - np.sqrt((r - 1)**2 + (alpha - 1)**2 + (beta - 1)**2)

def bias_pct(obs, sim):
    mask = ~(np.isnan(obs) | np.isnan(sim))
    o, s = obs[mask], sim[mask]
    return 100 * (s.sum() - o.sum()) / o.sum()


if Q_sim is not None:
    common_idx = Q_obs.index.intersection(Q_sim.index)
    o = Q_obs.loc[common_idx].values.astype(float)
    s = Q_sim.loc[common_idx].values.astype(float)

    nse_val = nse(o, s)
    kge_val = kge(o, s)
    bias_val = bias_pct(o, s)

    print('Diagnostic comparison obs vs simulated/proxy series (not calibration):')
    print(f'NSE  = {nse_val:.3f}')
    print(f'KGE  = {kge_val:.3f}')
    print(f'Bias = {bias_val:+.1f}%')
    print(f'Source = {Q_SIM_SOURCE}')

    diagnostics_df = pd.DataFrame({
        'NSE': [nse_val], 'KGE': [kge_val], 'Bias_pct': [bias_val],
        'source': [Q_SIM_SOURCE], 'interpreted_as_calibration': [False],
    })
    diagnostics_df.to_csv(OUT_DIR / 'simulation_diagnostics.csv', index=False)"""

                new_metrics_block = """def nse(obs, sim):
    \"\"\"Nash-Sutcliffe Efficiency.\"\"\"
    mask = ~(np.isnan(obs) | np.isnan(sim))
    o, s = obs[mask], sim[mask]
    if len(o) == 0:
        return np.nan
    return 1 - np.sum((o - s)**2) / np.sum((o - o.mean())**2)

def kge(obs, sim):
    \"\"\"Kling-Gupta Efficiency.\"\"\"
    mask = ~(np.isnan(obs) | np.isnan(sim))
    o, s = obs[mask], sim[mask]
    if len(o) < 2:
        return np.nan
    r  = np.corrcoef(o, s)[0, 1]
    alpha = s.std()  / o.std()
    beta  = s.mean() / o.mean()
    return 1 - np.sqrt((r - 1)**2 + (alpha - 1)**2 + (beta - 1)**2)

def bias_pct(obs, sim):
    mask = ~(np.isnan(obs) | np.isnan(sim))
    o, s = obs[mask], sim[mask]
    if len(o) == 0:
        return np.nan
    return 100 * (s.sum() - o.sum()) / o.sum()


if Q_sim is not None:
    common_idx = Q_obs.index.intersection(Q_sim.index)
    o = Q_obs.loc[common_idx].values.astype(float)
    s = Q_sim.loc[common_idx].values.astype(float)

    nse_val = nse(o, s)
    kge_val = kge(o, s)
    bias_val = bias_pct(o, s)

    # Monthly resampling and comparison
    Q_obs_m = Q_obs.resample('M').mean()
    Q_sim_m = Q_sim.resample('M').mean()
    common_idx_m = Q_obs_m.index.intersection(Q_sim_m.index)
    o_m = Q_obs_m.loc[common_idx_m].values.astype(float)
    s_m = Q_sim_m.loc[common_idx_m].values.astype(float)

    nse_m_val = nse(o_m, s_m)
    kge_m_val = kge(o_m, s_m)
    bias_m_val = bias_pct(o_m, s_m)

    print('Diagnostic comparison obs vs simulated/proxy series (daily):')
    print(f'Daily NSE  = {nse_val:.3f}')
    print(f'Daily KGE  = {kge_val:.3f}')
    print(f'Daily Bias = {bias_val:+.1f}%')
    print(f'Source = {Q_SIM_SOURCE}')

    print('\\nMonthly diagnostic comparison (resampled to monthly mean):')
    print(f'Monthly NSE  = {nse_m_val:.3f}')
    print(f'Monthly KGE  = {kge_m_val:.3f}')
    print(f'Monthly Bias = {bias_m_val:+.1f}%')

    diagnostics_df = pd.DataFrame({
        'Daily_NSE': [nse_val], 'Daily_KGE': [kge_val], 'Daily_Bias_pct': [bias_val],
        'Monthly_NSE': [nse_m_val], 'Monthly_KGE': [kge_m_val], 'Monthly_Bias_pct': [bias_m_val],
        'source': [Q_SIM_SOURCE], 'interpreted_as_calibration': [False],
    })
    diagnostics_df.to_csv(OUT_DIR / 'simulation_diagnostics.csv', index=False)"""

                source_norm = source.replace("\r\n", "\n")
                old_norm = old_metrics_block.replace("\r\n", "\n")
                new_norm = new_metrics_block.replace("\r\n", "\n")
                if old_norm in source_norm:
                    source_norm = source_norm.replace(old_norm, new_norm)
                    cell["source"] = [s + "\n" for s in source_norm.splitlines()]
                    if cell["source"] and not source_norm.endswith("\n"):
                        cell["source"][-1] = cell["source"][-1].rstrip("\n")
                    modified = True
                    print("Modified 05_continuous_simulation.ipynb metrics to include monthly")

            # Replacement 3: Identify diagnostic plot cell for Las Caldas insertion
            if "simulation_diagnostics_plot.png" in source:
                cells_to_insert.append(cell_idx)

    # Insert Las Caldas cells if found and not already inserted
    if cells_to_insert:
        has_caldas = False
        for c in nb["cells"]:
            c_src = "".join(c.get("source", []))
            if "Analysis of Las Caldas Station" in c_src:
                has_caldas = True
                break
        
        if not has_caldas:
            # We insert right after the first diagnostic plot cell found
            insert_idx = cells_to_insert[0]
            md_cell = {
                "cell_type": "markdown",
                "id": "las_caldas_md",
                "metadata": {},
                "source": [
                    "---\n",
                    "## 5b. Analysis of Las Caldas Station (upstream validation)\n",
                    "\n",
                    "Las Caldas gauge is located downstream of Los Corrales and integrates a larger portion of the Besaya basin. \n",
                    "This section evaluates the continuous simulation at Las Caldas against observed streamflow for the historical period (1973-2000)."
                ]
            }
            code_cell = {
                "cell_type": "code",
                "execution_count": None,
                "id": "las_caldas_code",
                "metadata": {},
                "outputs": [],
                "source": [
                    "# ── Analysis of Las Caldas Station ──────────────────────────────────────────\n",
                    "_caldas_csv = PROC_DIR / 'Las_caldas.csv'\n",
                    "if _caldas_csv.exists():\n",
                    "    try:\n",
                    "        # Load and parse Las Caldas data\n",
                    "        _df_caldas = pd.read_csv(_caldas_csv, index_col=0)\n",
                    "        _df_caldas.index = pd.DatetimeIndex([_parse_mixed_date(x) for x in _df_caldas.index])\n",
                    "        \n",
                    "        # Drop NaNs for valid periods\n",
                    "        _df_caldas_valid = _df_caldas.dropna()\n",
                    "        _df_caldas_valid = _df_caldas_valid[_df_caldas_valid.index >= '1973-10-01']\n",
                    "        \n",
                    "        o_c = _df_caldas_valid['Real'].values.astype(float)\n",
                    "        s_c = _df_caldas_valid['Simulado'].values.astype(float)\n",
                    "        \n",
                    "        nse_c = nse(o_c, s_c)\n",
                    "        kge_c = kge(o_c, s_c)\n",
                    "        bias_c = bias_pct(o_c, s_c)\n",
                    "        \n",
                    "        # Monthly resampling\n",
                    "        _df_caldas_m = _df_caldas_valid.resample('M').mean().dropna()\n",
                    "        o_cm = _df_caldas_m['Real'].values.astype(float)\n",
                    "        s_cm = _df_caldas_m['Simulado'].values.astype(float)\n",
                    "        \n",
                    "        nse_cm = nse(o_cm, s_cm)\n",
                    "        kge_cm = kge(o_cm, s_cm)\n",
                    "        bias_cm = bias_pct(o_cm, s_cm)\n",
                    "        \n",
                    "        print('Las Caldas Station Diagnostic Comparison (daily):')\n",
                    "        print(f'Daily NSE  = {nse_c:.3f}')\n",
                    "        print(f'Daily KGE  = {kge_c:.3f}')\n",
                    "        print(f'Daily Bias = {bias_c:+.1f}%')\n",
                    "        \n",
                    "        print(\'\\nLas Caldas Station Diagnostic Comparison (resampled to monthly mean):\')\n",
                    "        print(f'Monthly NSE  = {nse_cm:.3f}')\n",
                    "        print(f'Monthly KGE  = {kge_cm:.3f}')\n",
                    "        print(f'Monthly Bias = {bias_cm:+.1f}%')\n",
                    "        \n",
                    "        # Plot comparison\n",
                    "        fig, axes = plt.subplots(2, 1, figsize=(14, 9))\n",
                    "        \n",
                    "        ax = axes[0]\n",
                    "        ax.plot(_df_caldas_valid.index, _df_caldas_valid['Real'], color='steelblue', lw=0.8, label='Observed Las Caldas')\n",
                    "        ax.plot(_df_caldas_valid.index, _df_caldas_valid['Simulado'], color='tomato', lw=0.8, alpha=0.85, label='Simulated HMS')\n",
                    "        ax.set(ylabel='Q (m³/s)', title='Las Caldas Station Continuous Flow comparison (1973-2000)')\n",
                    "        ax.legend(fontsize=9)\n",
                    "        \n",
                    "        # Scatter obs vs sim\n",
                    "        ax2 = axes[1]\n",
                    "        ax2.scatter(_df_caldas_valid['Real'], _df_caldas_valid['Simulado'], s=4, alpha=0.4, color='steelblue')\n",
                    "        lim = [0, max(_df_caldas_valid['Real'].max(), _df_caldas_valid['Simulado'].max()) * 1.05]\n",
                    "        ax2.plot(lim, lim, 'r--', lw=1)\n",
                    "        ax2.set(xlabel='Q observado (m³/s)', ylabel='Q simulado (m³/s)', title='Las Caldas Scatter Diagram (obs vs sim)')\n",
                    "        \n",
                    "        plt.tight_layout()\n",
                    "        plt.savefig(OUT_DIR / 'las_caldas_diagnostics_plot.png', dpi=150)\n",
                    "        plt.show()\n",
                    "        \n",
                    "    except Exception as e:\n",
                    "        print(f'[WARN] Error al procesar Las Caldas: {e}')\n",
                    "else:\n",
                    "    print('Las_caldas.csv no encontrado en el directorio de datos procesados')\n"
                ]
            }
            nb["cells"].insert(insert_idx + 1, md_cell)
            nb["cells"].insert(insert_idx + 2, code_cell)
            modified = True
            print("Inserted Las Caldas validation section in notebook 05")

    if modified:
        with open(nb_path, "w", encoding="utf-8") as f:
            json.dump(nb, f, indent=1, ensure_ascii=False)
            f.write("\n")

def modify_nb_8():
    nb_path = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA/notebooks/pilot_cases/los_corrales_buelna/08_hybrid_return_periods.ipynb")
    with open(nb_path, "r", encoding="utf-8") as f:
        nb = json.load(f)
    modified = False
    for cell in nb["cells"]:
        if cell["cell_type"] == "code":
            source = "".join(cell["source"])
            # Let's target the exact cell 26 with ctrl_peaks loading
            if "ctrl_peaks = dict(met_hab_qpico)" in source and "cc_peaks = {}" in source and "Option A" in source:
                old_block = """ctrl_peaks = dict(met_hab_qpico)   # {T: Qpico_m3s}

cc_peaks = {}

# ── Option A: read from HEC-HMS DSS if HMS was executed ─────────────────────
dss_path = HMS_DIR / f'{NAME_MODEL}.dss'
if dss_path.exists() and cc_run_names:
    for run_name, (T, ssp) in zip(cc_run_names, cc_hietogramas.keys()):
        try:
            df_dss = read_dss6_timeseries(
                str(dss_path),
                pathname_prefix='//REACH-5/FLOW',
            )
            cc_peaks[(T, ssp)] = float(df_dss['value'].max())
        except Exception as e:
            print(f'  DSS read error ({run_name}): {e}')

# ── Option B: delta-method analytical fallback ────────────────────────────────
# Applied when HEC-HMS is not available (release / teaching mode).
# ALPHA=1: linear precipitation → peak-flow scaling.
# Justification: without a calibrated rainfall-runoff model we cannot determine
# a non-linear exponent; α=1 gives a conservative lower-bound scenario estimate.
if not cc_peaks:
    ALPHA = 1.0
    for (T, ssp) in cc_hietogramas.keys():
        Q_ctrl = ctrl_peaks.get(T, np.nan)
        if ssp == 'control':
            cc_peaks[(T, ssp)] = round(Q_ctrl, 1) if pd.notna(Q_ctrl) else np.nan
        elif pd.notna(Q_ctrl):
            delta = delta_calibrated.get(ssp, {}).get(T, 1.0)
            cc_peaks[(T, ssp)] = round(Q_ctrl * (delta ** ALPHA), 1)
        else:
            cc_peaks[(T, ssp)] = np.nan"""

                new_block = """ctrl_peaks = dict(met_hab_qpico)   # {T: Qpico_m3s}

cc_peaks = {}

# ── Prioridad 1: Leer de los CSVs de hidrogramas pre-calculados ─────────────
_cc_dir = PROC_DIR / 'hydrographs_maxdiss' / 'Met_Hab_CC'
_ctrl_dir = PROC_DIR / 'hydrographs_maxdiss' / 'Met_Hab'

if _ctrl_dir.exists() and _cc_dir.exists():
    try:
        # Cargamos control (baseline)
        for T in RETURN_PERIODS:
            f_ctrl = _ctrl_dir / f'Hidrograma_T{T}.csv'
            if f_ctrl.exists():
                df_ctrl = pd.read_csv(f_ctrl, index_col=0)
                cc_peaks[(T, 'control')] = float(df_ctrl.iloc[:, 0].max())
                ctrl_peaks[T] = cc_peaks[(T, 'control')]
        
        # Cargamos los escenarios de cambio climático (2041-2070)
        for T in RETURN_PERIODS:
            for ssp in SCENARIOS:
                f_cc = _cc_dir / f'Hidrograma_T{T}_{ssp}_2041_2070.csv'
                if f_cc.exists():
                    df_cc = pd.read_csv(f_cc, index_col=0)
                    cc_peaks[(T, ssp)] = float(df_cc.iloc[:, 0].max())
                    
        if len(cc_peaks) > 0:
            print(f'[OK] Caudales pico CC cargados desde archivos CSV pre-calculados (2041-2070)')
    except Exception as e:
        print(f'[WARN] Error cargando caudales desde CSV: {e}')
        cc_peaks = {}

# ── Option A (Fallback): read from HEC-HMS DSS if HMS was executed ─────────
if not cc_peaks:
    dss_path = HMS_DIR / f'{NAME_MODEL}.dss'
    if dss_path.exists() and cc_run_names:
        for run_name, (T, ssp) in zip(cc_run_names, cc_hietogramas.keys()):
            try:
                df_dss = read_dss6_timeseries(
                    str(dss_path),
                    pathname_prefix='//REACH-5/FLOW',
                )
                cc_peaks[(T, ssp)] = float(df_dss['value'].max())
            except Exception as e:
                print(f'  DSS read error ({run_name}): {e}')

# ── Option B (Fallback): delta-method analytical fallback ──────────────────
# Applied when HEC-HMS is not available (release / teaching mode).
# ALPHA=1: linear precipitation → peak-flow scaling.
# Justification: without a calibrated rainfall-runoff model we cannot determine
# a non-linear exponent; α=1 gives a conservative lower-bound scenario estimate.
if not cc_peaks:
    ALPHA = 1.0
    for (T, ssp) in cc_hietogramas.keys():
        Q_ctrl = ctrl_peaks.get(T, np.nan)
        if ssp == 'control':
            cc_peaks[(T, ssp)] = round(Q_ctrl, 1) if pd.notna(Q_ctrl) else np.nan
        elif pd.notna(Q_ctrl):
            delta = delta_calibrated.get(ssp, {}).get(T, 1.0)
            cc_peaks[(T, ssp)] = round(Q_ctrl * (delta ** ALPHA), 1)
        else:
            cc_peaks[(T, ssp)] = np.nan"""

                source_norm = source.replace("\r\n", "\n")
                old_norm = old_block.replace("\r\n", "\n")
                new_norm = new_block.replace("\r\n", "\n")
                if old_norm in source_norm:
                    source_norm = source_norm.replace(old_norm, new_norm)
                    cell["source"] = [s + "\n" for s in source_norm.splitlines()]
                    if cell["source"] and not source_norm.endswith("\n"):
                        cell["source"][-1] = cell["source"][-1].rstrip("\n")
                    modified = True
                    print("Modified 08_hybrid_return_periods.ipynb peak flows loading")
                else:
                    print("Could not find the target code block in cell 26!")
    if modified:
        with open(nb_path, "w", encoding="utf-8") as f:
            json.dump(nb, f, indent=1, ensure_ascii=False)
            f.write("\n")

modify_nb_4()
modify_nb_5()
modify_nb_8()
