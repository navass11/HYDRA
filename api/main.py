from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import compound, copulas, interpolation, meteostat, notebooks, sensitivity, statistical, stochastic

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


@app.get("/api/health")
def health():
    return {"status": "ok"}
