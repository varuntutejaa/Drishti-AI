from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import analysis, dashboard, patients, reports, screenings
from app.database.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RETINA-AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients.router, prefix="/api/v1")
app.include_router(screenings.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")

@app.get("/api/v1/health")
def health():
    return {"status": "ok", "demo_mode": True, "message": "RETINA-AI screening API ready"}
