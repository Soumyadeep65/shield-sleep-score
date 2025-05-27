from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SleepScoreRequest(BaseModel):
    total_sleep_hours: float = Field(..., gt=0, lt=24)
    sleep_efficiency: float = Field(..., ge=0, le=100)
    REM_percentage: float = Field(..., ge=0, le=100)
    age: int = Field(..., ge=0, le=120)
    sex: str = Field(..., pattern="^(male|female|other)$")

class SleepScoreResponse(BaseModel):
    shield_score: int
    bio_age_delta: str
    alerts: List[str]

@app.post("/api/sleep-score", response_model=SleepScoreResponse)
def calculate_sleep_score(data: SleepScoreRequest):
    score = 100
    alerts = []
    # Rule 1
    if data.total_sleep_hours < 6:
        score -= 10
        alerts.append("Insufficient total hours")
    # Rule 2
    if data.sleep_efficiency < 85:
        score -= 5
        alerts.append("Low sleep efficiency")
    # Rule 3
    if data.REM_percentage < 15:
        score -= 5
        alerts.append("Low REM sleep")
    # Rule 4
    if data.age > 50 and data.total_sleep_hours < 6:
        score -= 5
        if "Insufficient total hours" not in alerts:
            alerts.append("Insufficient total hours (age risk)")
    # Clamp score
    score = max(0, min(100, score))
    # Bio age delta logic (simple mapping)
    if score >= 90:
        delta = "0"
    elif score >= 80:
        delta = "+0.5"
    elif score >= 70:
        delta = "+1.0"
    elif score >= 60:
        delta = "+1.5"
    else:
        delta = "+2.0"
    return SleepScoreResponse(
        shield_score=score,
        bio_age_delta=delta,
        alerts=alerts
    ) 