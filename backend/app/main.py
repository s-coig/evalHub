from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import eval_runs_router, reports_router

settings = get_settings()

app = FastAPI(
    title="Eval Platform API",
    description="API for LLM evaluation result communication",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(eval_runs_router)
app.include_router(reports_router)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/")
def root():
    return {"message": "Eval Platform API", "docs": "/docs"}
