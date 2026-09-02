from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models.schemas import ComplaintInput, AIAnalysisOutput
from .ml.predict import analyze_complaint
import logging

app = FastAPI(title="CivicAI Local Backend Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "CivicAI Engine Operational"}

@app.post("/api/analyze", response_model=AIAnalysisOutput)
def api_analyze_complaint(complaint: ComplaintInput):
    # Perform local ML prediction
    analysis = analyze_complaint(complaint)
    return analysis
