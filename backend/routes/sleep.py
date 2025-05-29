from fastapi import APIRouter
from models.sleep import SleepScoreRequest, SleepScoreResponse
from services.sleep_service import calculate_sleep_score_service

router = APIRouter()

@router.post("/sleep-score", response_model=SleepScoreResponse)
def sleep_score(data: SleepScoreRequest):
    return calculate_sleep_score_service(data) 