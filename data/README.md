# data/

This folder is mounted into the Docker container at `/workspace/data/`.  
It is **not tracked by git** (see `.gitignore`).

## Structure expected by the modeling notebooks

```
data/
├── hms/
│   └── Punxsutawney/          ← HEC-HMS Punxsutawney tutorial project
│       ├── Punxsutawney.hms
│       ├── Punxsutawney.basin
│       ├── Punxsutawney.gage
│       └── ...
├── hec_ras/
│   └── Muncie/                ← HEC-RAS Muncie 2D tutorial project
│       ├── Muncie.prj
│       └── ...
├── swat/
│   └── swatplus_tutorial/     ← SWAT+ tutorial watershed
│       └── TxtInOut/
│           ├── file.cio
│           ├── pcp1.pcp
│           └── ...
├── sfincs/
│   └── lismore/               ← downloaded automatically by the SFINCS notebook
│       ├── dem_copernicus30m.tif
│       └── ...
└── gis/
    └── punxsutawney/          ← GIS layers for HMS parameter extraction
        ├── subbasins.shp
        ├── curve_number.tif
        └── ...
```

## Where to get the example data

| Model    | Source                                                              |
|----------|---------------------------------------------------------------------|
| HEC-HMS  | HEC-HMS → Help → Sample Projects → Punxsutawney                    |
| HEC-RAS  | HEC-RAS → Help → Example Data Sets → 2D Unsteady → Muncie_2D      |
| SWAT+    | https://swatplus.gitbook.io/docs/user/gui/tutorials                 |
| SFINCS   | Downloaded automatically in the SFINCS notebook (first cell)       |

HEC-HMS and HEC-RAS are **Windows-only** — the notebooks prepare input files on any OS
but execution requires running the software on Windows.  
SFINCS and SWAT+ have Linux binaries and can run fully inside Docker.
