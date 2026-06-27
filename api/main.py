from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import bias, compound, copulas, hydraulic, idf, interpolation, meteostat, notebooks, rfa, sensitivity, statistical, stochastic, trend

app = FastAPI(title="HYDRA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stochastic.router, prefix="/api/stochastic", tags=["stochastic"])
app.include_router(sensitivity.router, prefix="/api/sensitivity", tags=["sensitivity"])
app.include_router(statistical.router, prefix="/api/statistical", tags=["statistical"])
app.include_router(copulas.router, prefix="/api/copulas", tags=["copulas"])
app.include_router(notebooks.router, prefix="/api/notebooks", tags=["notebooks"])
app.include_router(meteostat.router, prefix="/api/meteostat", tags=["meteostat"])
app.include_router(compound.router, prefix="/api/compound", tags=["compound"])
app.include_router(interpolation.router, prefix="/api/interpolation", tags=["interpolation"])
app.include_router(idf.router, prefix="/api/idf", tags=["idf"])
app.include_router(bias.router, prefix="/api/bias", tags=["bias"])
app.include_router(trend.router, prefix="/api/trend", tags=["trend"])
app.include_router(rfa.router, prefix="/api/rfa", tags=["rfa"])
app.include_router(hydraulic.router, prefix="/api/hydraulic", tags=["hydraulic"])


@app.get("/api/health")
def health():
    return {"status": "ok"}
