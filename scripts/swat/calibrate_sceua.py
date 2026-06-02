"""SCE-UA autocalibration — Oulanka SWAT+ — corrected channel_sd_mon reader."""
import sys, os, tempfile, shutil, time
sys.path.insert(0, '/workspace')

import numpy as np, pandas as pd, spotpy
from pathlib import Path
from pySWATPlus import TxtinoutReader

SWAT_DIR  = Path('/workspace/data/swat/lrew')
DB_PATH   = '/tmp/swat_sceua'
N_EVALS   = 100
SIM_START = '01-Jan-2010'
SIM_END   = '31-Dec-2012'
WARMUP    = 1

Q_OBS = np.array([
    5.17,  4.76,  4.26, 25.72, 50.74, 23.54, 23.69, 17.63, 10.54, 37.05, 19.54, 10.76,
    7.62,  6.39,  5.52,  5.16,134.79, 30.75, 34.69, 13.47, 19.67, 37.83, 24.66, 17.24,
])

CAL_PARAMS = [
    spotpy.parameter.Uniform('cn2',         -10,  10),
    spotpy.parameter.Uniform('esco',          0.0, 1.0),
    spotpy.parameter.Uniform('alpha',         0.0, 1.0),
    spotpy.parameter.Uniform('flo_min',       0.0,50.0),
    spotpy.parameter.Uniform('snomelt_max',   0.0,10.0),
    spotpy.parameter.Uniform('snomelt_min',   0.0,10.0),
    spotpy.parameter.Uniform('snomelt_tmp',  -5.0, 5.0),
]

def _read_monthly_flow(sim_dir):
    ch_file = Path(sim_dir) / 'channel_sd_mon.txt'
    if not ch_file.exists():
        return None
    with open(ch_file) as f:
        f.readline()               # skip title line
        raw_header = f.readline().split()   # actual column names
    seen, cols = {}, []
    for n in raw_header:
        cnt = seen.get(n, 0)
        cols.append(n if cnt == 0 else f'{n}_{cnt}')
        seen[n] = cnt + 1
    df = pd.read_csv(ch_file, sep=r'\s+', skiprows=3, names=cols, engine='python')
    outlet = int(df['unit'].max())
    df_out = df[(df['unit'] == outlet) & (df['yr'] >= 2011) & (df['yr'] <= 2012)]
    q = df_out['flo_out'].values[:24]
    return q if len(q) == 24 else None

class spotpy_swat:
    def __init__(self): self.params = CAL_PARAMS
    def parameters(self): return spotpy.parameter.generate(self.params)

    def simulation(self, vector):
        params = [
            {'name': 'cn2',         'change_type': 'pctchg', 'value': float(vector[0])},
            {'name': 'esco',        'change_type': 'absval',  'value': float(vector[1])},
            {'name': 'alpha',       'change_type': 'absval',  'value': float(vector[2])},
            {'name': 'flo_min',     'change_type': 'absval',  'value': float(vector[3])},
            {'name': 'snomelt_max', 'change_type': 'absval',  'value': float(vector[4])},
            {'name': 'snomelt_min', 'change_type': 'absval',  'value': float(vector[5])},
            {'name': 'snomelt_tmp', 'change_type': 'absval',  'value': float(vector[6])},
        ]
        sim_dir = tempfile.mkdtemp(prefix='/tmp/swat_e_')
        try:
            TxtinoutReader(str(SWAT_DIR)).run_swat(
                sim_dir=sim_dir, parameters=params,
                begin_date=SIM_START, end_date=SIM_END, warmup=WARMUP,
            )
            q = _read_monthly_flow(sim_dir)
            return q if q is not None else np.full(24, -9999.0)
        except Exception as e:
            print(f'  err: {e}', flush=True)
            return np.full(24, -9999.0)
        finally:
            shutil.rmtree(sim_dir, ignore_errors=True)

    def evaluation(self): return Q_OBS

    def objectivefunction(self, simulation, evaluation):
        if np.any(simulation < -100): return -9999.0
        return spotpy.objectivefunctions.nashsutcliffe(evaluation, simulation)

for ext in ['.csv', '.hdf5']:
    f = Path(DB_PATH + ext)
    if f.exists(): f.unlink()

setup   = spotpy_swat()
sampler = spotpy.algorithms.sceua(setup, dbname=DB_PATH, dbformat='csv',
                                   save_sim=True, random_state=42)
print(f'Starting SCE-UA  n_evals={N_EVALS}  n_params=7', flush=True)
t0 = time.time()
sampler.sample(N_EVALS, ngs=3)
elapsed = time.time() - t0
print(f'Done in {elapsed:.0f}s ({elapsed/N_EVALS:.1f}s/eval)', flush=True)

db   = pd.read_csv(DB_PATH + '.csv')
best = db.loc[db['like1'].idxmax()]
print(f'Total evals: {len(db)}  Best NSE: {best["like1"]:.4f}', flush=True)
for c in [col for col in db.columns if col.startswith('par')]:
    print(f'  {c[3:]}: {best[c]:.4f}', flush=True)
