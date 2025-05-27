from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import math
import os

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
    sleep_latency: float = Field(..., ge=0, le=180)  # in minutes
    hrv: float = Field(..., ge=0, le=300)  # ms
    timing_consistency: float = Field(..., ge=0, le=12)  # hours variation
    chronotype_alignment: bool

class SleepScoreResponse(BaseModel):
    shield_score: int
    bio_age_delta: float
    alerts: List[str]
    breakdown: Dict[str, Any]

# Optimal Ranges
OPTIMAL = {
    "total_sleep_hours": (7, 8.5),
    "sleep_efficiency": 85,
    "REM_percentage": (20, 25),
    "sleep_latency": 20,
    "hrv": 50,
    "timing_consistency": 1,
    "chronotype_alignment": True,
}
# Weights
WEIGHTS = {
    "hrv": 0.25,
    "total_sleep_hours": 0.20,
    "sleep_efficiency": 0.15,
    "REM_percentage": 0.10,
    "sleep_latency": 0.10,
    "timing_consistency": 0.10,
    "chronotype_alignment": 0.10,
}

@app.post("/api/sleep-score", response_model=SleepScoreResponse)
def calculate_sleep_score(data: SleepScoreRequest):
    score = 100
    alerts = []
    breakdown = {}
    delta = 0.0

    # HRV
    if data.hrv < OPTIMAL["hrv"]:
        hrv_penalty = min(2.0, (OPTIMAL["hrv"] - data.hrv) / OPTIMAL["hrv"]) * WEIGHTS["hrv"]
        delta += hrv_penalty
        breakdown["hrv"] = {"value": data.hrv, "optimal": f">{OPTIMAL['hrv']}ms", "impact": round(hrv_penalty, 2)}
        alerts.append("Low HRV")
    else:
        breakdown["hrv"] = {"value": data.hrv, "optimal": f">{OPTIMAL['hrv']}ms", "impact": 0}

    # Total Sleep Time
    if not (OPTIMAL["total_sleep_hours"][0] <= data.total_sleep_hours <= OPTIMAL["total_sleep_hours"][1]):
        if data.total_sleep_hours < OPTIMAL["total_sleep_hours"][0]:
            penalty = min(2.0, (OPTIMAL["total_sleep_hours"][0] - data.total_sleep_hours) / OPTIMAL["total_sleep_hours"][0])
            alerts.append("Insufficient total sleep time")
        else:
            penalty = min(2.0, (data.total_sleep_hours - OPTIMAL["total_sleep_hours"][1]) / OPTIMAL["total_sleep_hours"][1])
            alerts.append("Excessive total sleep time")
        penalty *= WEIGHTS["total_sleep_hours"]
        delta += penalty
        breakdown["total_sleep_hours"] = {"value": data.total_sleep_hours, "optimal": f"{OPTIMAL['total_sleep_hours'][0]}–{OPTIMAL['total_sleep_hours'][1]}h", "impact": round(penalty, 2)}
    else:
        breakdown["total_sleep_hours"] = {"value": data.total_sleep_hours, "optimal": f"{OPTIMAL['total_sleep_hours'][0]}–{OPTIMAL['total_sleep_hours'][1]}h", "impact": 0}

    # Sleep Efficiency
    if data.sleep_efficiency < OPTIMAL["sleep_efficiency"]:
        penalty = min(2.0, (OPTIMAL["sleep_efficiency"] - data.sleep_efficiency) / OPTIMAL["sleep_efficiency"]) * WEIGHTS["sleep_efficiency"]
        delta += penalty
        breakdown["sleep_efficiency"] = {"value": data.sleep_efficiency, "optimal": f">={OPTIMAL['sleep_efficiency']}%", "impact": round(penalty, 2)}
        alerts.append("Low sleep efficiency")
    else:
        breakdown["sleep_efficiency"] = {"value": data.sleep_efficiency, "optimal": f">={OPTIMAL['sleep_efficiency']}%", "impact": 0}

    # REM %
    if not (OPTIMAL["REM_percentage"][0] <= data.REM_percentage <= OPTIMAL["REM_percentage"][1]):
        if data.REM_percentage < OPTIMAL["REM_percentage"][0]:
            penalty = min(2.0, (OPTIMAL["REM_percentage"][0] - data.REM_percentage) / OPTIMAL["REM_percentage"][0])
            alerts.append("Low REM sleep")
        else:
            penalty = min(2.0, (data.REM_percentage - OPTIMAL["REM_percentage"][1]) / OPTIMAL["REM_percentage"][1])
            alerts.append("High REM sleep")
        penalty *= WEIGHTS["REM_percentage"]
        delta += penalty
        breakdown["REM_percentage"] = {"value": data.REM_percentage, "optimal": f"{OPTIMAL['REM_percentage'][0]}–{OPTIMAL['REM_percentage'][1]}%", "impact": round(penalty, 2)}
    else:
        breakdown["REM_percentage"] = {"value": data.REM_percentage, "optimal": f"{OPTIMAL['REM_percentage'][0]}–{OPTIMAL['REM_percentage'][1]}%", "impact": 0}

    # Sleep Latency
    if data.sleep_latency > OPTIMAL["sleep_latency"]:
        penalty = min(2.0, (data.sleep_latency - OPTIMAL["sleep_latency"]) / OPTIMAL["sleep_latency"]) * WEIGHTS["sleep_latency"]
        delta += penalty
        breakdown["sleep_latency"] = {"value": data.sleep_latency, "optimal": f"< {OPTIMAL['sleep_latency']} min", "impact": round(penalty, 2)}
        alerts.append("High sleep latency")
    else:
        breakdown["sleep_latency"] = {"value": data.sleep_latency, "optimal": f"< {OPTIMAL['sleep_latency']} min", "impact": 0}

    # Timing Consistency
    if data.timing_consistency > OPTIMAL["timing_consistency"]:
        penalty = min(2.0, (data.timing_consistency - OPTIMAL["timing_consistency"]) / OPTIMAL["timing_consistency"]) * WEIGHTS["timing_consistency"]
        delta += penalty
        breakdown["timing_consistency"] = {"value": data.timing_consistency, "optimal": f"< {OPTIMAL['timing_consistency']} hr", "impact": round(penalty, 2)}
        alerts.append("Irregular sleep timing")
    else:
        breakdown["timing_consistency"] = {"value": data.timing_consistency, "optimal": f"< {OPTIMAL['timing_consistency']} hr", "impact": 0}

    # Chronotype Alignment
    if not data.chronotype_alignment:
        penalty = WEIGHTS["chronotype_alignment"]
        delta += penalty
        breakdown["chronotype_alignment"] = {"value": data.chronotype_alignment, "optimal": "Aligned", "impact": round(penalty, 2)}
        alerts.append("Chronotype misalignment")
    else:
        breakdown["chronotype_alignment"] = {"value": data.chronotype_alignment, "optimal": "Aligned", "impact": 0}

    # Clamp delta, round to 2 decimals
    delta = round(delta, 2)
    if delta == 0:
        delta = -0.5  # Bonus for optimal sleep
    
    # SHIELD Score (for now, keep as 100 - 10*delta, clamp 0-100)
    shield_score = max(0, min(100, int(100 - 10 * max(0, delta))))

    return SleepScoreResponse(
        shield_score=shield_score,
        bio_age_delta=delta,
        alerts=alerts,
        breakdown=breakdown
    ) 