from fastapi import APIRouter, UploadFile, File, HTTPException
from models.lab import LabUploadResponse
from services.lab_service import extract_biomarkers_from_pdf

router = APIRouter()

@router.post("/lab-upload", response_model=LabUploadResponse)
def lab_upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files allowed.")
    result = extract_biomarkers_from_pdf(file)
    return LabUploadResponse(
        filename=file.filename,
        biomarkers=result["biomarkers"],
        suggestions=result["suggestions"],
        message="File received securely. Biomarker extraction complete."
    ) 