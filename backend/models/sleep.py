from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SleepScoreRequest(BaseModel):
    total_sleep_hours: float = Field(..., gt=0, lt=24)
    sleep_efficiency: float = Field(..., ge=0, le=100)
    REM_percentage: float = Field(..., ge=0, le=100)
    age: int = Field(..., ge=0, le=120)
    sex: str = Field(..., pattern="^(male|female|other)$")
    sleep_latency: float = Field(..., ge=0, le=180)
    hrv: float = Field(..., ge=0, le=300)
    timing_consistency: float = Field(..., ge=0, le=12)
    chronotype_alignment: bool

class AlertObj(BaseModel):
    message: str
    severity: str
    suggestion: Optional[str] = None

class SleepScoreResponse(BaseModel):
    shield_score: int
    bio_age_delta: float
    alerts: List[AlertObj]
    breakdown: Dict[str, Any] 