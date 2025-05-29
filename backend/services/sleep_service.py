import os
import openai
from dotenv import load_dotenv
from utils.metrics import METRICS
from models.sleep import SleepScoreRequest, SleepScoreResponse
from fastapi import HTTPException

load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def get_openai_suggestion_for_alert(alert: str, metric: dict) -> str:
    prompt = f"Alert: {alert}\nMetric details: {metric}\nGive a short, actionable suggestion for the patient."
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are a medical assistant."}, {"role": "user", "content": prompt}],
            max_tokens=64,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"(OpenAI error: {e})"

def calculate_sleep_score_service(data: SleepScoreRequest) -> SleepScoreResponse:
    alerts = []
    alert_suggestions = []
    breakdown = {}
    delta = 0.0
    for key, meta in METRICS.items():
        value = getattr(data, key)
        weight = meta["weight"]
        label = meta["label"]
        optimal = meta["optimal"]
        direction = meta["direction"]
        minv, maxv = meta["range"]
        if (isinstance(value, (int, float)) and (value < minv or value > maxv)) or (direction == "bool" and not isinstance(value, bool)):
            raise HTTPException(status_code=422, detail=f"{label} value {value} out of range {meta['range']}")
        penalty = 0
        alert = None
        if direction == "high":
            if value < optimal:
                penalty = min(2.0, (optimal - value) / optimal) * weight
                alert = f"Low {label}"
        elif direction == "low":
            if value > optimal:
                penalty = min(2.0, (value - optimal) / optimal) * weight
                alert = f"High {label}"
        elif direction == "range":
            if not (optimal[0] <= value <= optimal[1]):
                if value < optimal[0]:
                    penalty = min(2.0, (optimal[0] - value) / optimal[0]) * weight
                    alert = f"Low {label}"
                else:
                    penalty = min(2.0, (value - optimal[1]) / optimal[1]) * weight
                    alert = f"High {label}"
        elif direction == "bool":
            if value != optimal:
                penalty = weight
                alert = f"Chronotype misalignment"
        delta += penalty
        breakdown[key] = {
            "value": value,
            "optimal": optimal if direction != "range" else f"{optimal[0]}–{optimal[1]}",
            "impact": round(penalty, 2),
            "label": label,
            "help": meta["help"],
        }
        if alert and penalty > 0:
            alerts.append(alert)
            # Get suggestion for this alert
            alert_suggestions.append(get_openai_suggestion_for_alert(alert, breakdown[key]))
    delta = round(delta, 2)
    if delta == 0:
        delta = -0.5
    shield_score = max(0, min(100, int(100 - 10 * max(0, delta))))
    # Attach suggestions to alerts
    alert_objs = [
        {"message": msg, "severity": "warning" if "high" in msg.lower() else "info", "suggestion": alert_suggestion}
        for msg, alert_suggestion in zip(alerts, alert_suggestions)
    ]
    return SleepScoreResponse(
        shield_score=shield_score,
        bio_age_delta=delta,
        alerts=alert_objs,
        breakdown=breakdown
    ) 