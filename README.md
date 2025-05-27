# SHIELD Longevity Module

## Overview
A full-stack application to calculate and visualize a SHIELD Sleep Score and biological age delta, with actionable alerts and suggestions. Built with Python FastAPI (backend) and React (frontend).

---

## Architecture
- **Backend:** Python FastAPI REST API
  - Endpoint: `/api/sleep-score`
  - Handles scoring logic, input validation, and CORS
- **Frontend:** React (TypeScript, PWA-ready)
  - Dashboard widget for user input, score display, alerts, and suggestions
  - Fetches data from backend API

---

## Assumptions
- The scoring rules are as described in the prompt
- No authentication is required for this demo
- The backend and frontend run on localhost (default ports: 8000 for API, 3000 for frontend)
- Suggestions for alerts are static and mapped in the frontend

---

## How to Run

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm start
```
- The app will open at [http://localhost:3000](http://localhost:3000)
- Ensure the backend is running at [http://localhost:8000](http://localhost:8000)

---

## Testing
- Use the dashboard widget to enter values and view the score, bio-age delta, and alerts
- Try edge cases (e.g., very low sleep hours, high age, etc.)

---

## Deployment
- **Backend:** Deployable on any cloud (Heroku, AWS, Azure, etc.) supporting FastAPI/Uvicorn
- **Frontend:** Deployable on Vercel, Netlify, or any static hosting
- For production, set CORS origins and use HTTPS

---

## Technical & Ethics Answers

### 1. Dynamic Scoring Weights with Machine Learning
- Replace hardcoded rules with a model trained on real-world sleep/health data
- Use features (sleep hours, efficiency, REM, age, sex, etc.) as input to a regression/classification model
- Store model weights in a database or as a serialized file (e.g., joblib/pickle)
- Expose an endpoint for model inference; retrain periodically as more data is collected
- Optionally, allow weights to be updated via an admin interface

### 2. Secure Lab Report Upload & Biomarker Extraction
- Use secure file upload endpoints (e.g., FastAPI's `UploadFile` with authentication)
- Store files encrypted at rest (e.g., AWS S3 with server-side encryption)
- Use OCR/NLP pipelines to extract biomarker data (e.g., CRP, glucose) from PDFs/images
- Only allow access to authorized users; audit all access
- Delete files after extraction if not needed

### 3. Ensuring HIPAA Compliance
- Use HTTPS for all API endpoints
- Authenticate and authorize all users (OAuth2, JWT, etc.)
- Log access to PHI (Protected Health Information)
- Store sensitive data encrypted at rest and in transit
- Regularly audit code and infrastructure for vulnerabilities
- Provide a way for patients to access, amend, or delete their data
- Train staff/developers on HIPAA best practices

---