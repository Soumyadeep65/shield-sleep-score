import pdfplumber
import re
from typing import Dict, Any
from fastapi import HTTPException, UploadFile
import tempfile
import os
import requests
import openai
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def get_openai_suggestions(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are a medical assistant."}, {"role": "user", "content": prompt}],
            max_tokens=256,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"(OpenAI error: {e})"

def get_lab_suggestions(report_text: str, extracted: Dict[str, Any]) -> str:
    prompt = (
        "Given the following lab report text and extracted values, "
        "summarize the key findings, highlight any out-of-range or borderline values, and provide actionable suggestions for the patient.\n\n"
        f"Lab Report Text:\n{report_text}\n\nExtracted Values:\n{extracted}\n\nSummary and Suggestions:"
    )
    return get_openai_suggestions(prompt)

def get_alert_suggestions(alerts: list, breakdown: dict) -> list:
    # For each alert, get a suggestion from OpenAI
    suggestions = []
    for alert in alerts:
        metric = None
        for k, v in breakdown.items():
            if v['label'] in alert or k in alert:
                metric = v
                break
        prompt = f"Alert: {alert}\nMetric details: {metric}\nGive a short, actionable suggestion for the patient."
        suggestion = get_openai_suggestions(prompt)
        suggestions.append(suggestion)
    return suggestions

def extract_important_lab_values(text: str) -> Dict[str, Any]:
    patterns = {
        "Hemoglobin": r"HAEMOGLOBIN\s+([\d.]+)\s*(g/dL)\s+([\d.-]+)-(\d+)",
        "PCV": r"PCV\s+([\d.]+)\s*(%)\s+([\d.-]+)-(\d+)",
        "TSH": r"TSH.*?([\d.]+)\s*µIU/mL\s*([\d.]+)-([\d.]+)",
        "Glucose, Fasting": r"Glucose, Fasting\*?\s*([\d.]+)\s*mg/dL",
        "Platelet Count": r"PLATELET COUNT\s+([\d,]+)\s*cells/cu.mm\s+([\d,]+)-([\d,]+)",
        "WBC": r"TOTAL LEUCOCYTE COUNT.*?([\d,]+)\s*cells/cu.mm\s+([\d,]+)-([\d,]+)",
        "MCV": r"MCV\s+([\d.]+)\s*fL\s+([\d.]+)-([\d.]+)",
        "MCH": r"MCH\s+([\d.]+)\s*pg\s+([\d.]+)-([\d.]+)",
        "MCHC": r"MCHC\s+([\d.]+)\s*g/dL\s+([\d.]+)-([\d.]+)",
        # Add more as needed
    }
    results = {}
    for marker, pat in patterns.items():
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            results[marker] = {
                "value": match.group(1),
                "unit": match.group(2) if len(match.groups()) > 1 else "",
                "ref_low": match.group(3) if len(match.groups()) > 2 else "",
                "ref_high": match.group(4) if len(match.groups()) > 3 else "",
            }
    # Extract status (IN RANGE, BORDERLINE, OUT OF RANGE)
    for status in ["IN RANGE", "BORDERLINE", "OUT OF RANGE"]:
        for m in re.finditer(r"([A-Z ()*]+)\n[\d.]+.*?\n" + status, text):
            marker = m.group(1).strip()
            if marker in results:
                results[marker]["status"] = status
    return results

def extract_biomarkers_from_pdf(file: UploadFile) -> Dict[str, Any]:
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file.filename)
    with open(temp_path, "wb") as f:
        f.write(file.file.read())
    try:
        with pdfplumber.open(temp_path) as pdf:
            text = "\n".join(page.extract_text() or '' for page in pdf.pages)
        extracted = extract_important_lab_values(text)
        suggestions = get_lab_suggestions(text, extracted)
        return {
            "biomarkers": extracted,
            "suggestions": suggestions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract biomarkers: {e}") 