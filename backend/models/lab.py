from pydantic import BaseModel
from typing import Dict, Any

class LabUploadResponse(BaseModel):
    filename: str
    biomarkers: Dict[str, Any]
    suggestions: str
    message: str 