# HYDRA

> A modular Python library for hydroclimatic data management, bias correction, and hydrological modeling — designed for climate change impact studies and water balance analysis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)

---

## 🌊 Overview

**HYDRA** provides a set of tools for automating the extraction, preprocessing, correction, and analysis of hydroclimatic datasets. The library supports large-scale studies that combine remote sensing, reanalysis products, and climate model outputs for hydrological and environmental applications.

---

## ✨ Key Features

- 🌐 **Climate Data Downloader**  
  Extracts data from multiple sources like GPM, PERSIANN, ERA5-Land, CMIP6 (historical + SSPs).

- 📉 **Bias Correction Module**  
  Applies advanced bias correction techniques such as Scaled Distribution Mapping (SDM) at station, grid, or basin level.

- 💧 **Water Balance & Flow Prediction**  
  Trains and evaluates models (including ML regressors) to estimate streamflow and perform water balance computations.

- 🧠 **AI/ML Integration**  
  Automated training with GridSearchCV across multiple algorithms and metrics (e.g., NSE, R², PBIAS).

- 🗺️ **NetCDF Processing**  
  Supports spatial clipping, averaging over polygons (e.g., wetlands), time series extraction and NetCDF generation for climate and hydrological variables.

- 🧪 **Simulation Tools**  
  Integration with tools for synthetic time series generation and return period analysis (e.g., GEV models).

---

## 🛠️ Installation

```bash
pip install -e. 
```

Or clone the repository:

git clone https://github.com/yourusername/hydra.git
cd hydra
pip install -r requirements.txt