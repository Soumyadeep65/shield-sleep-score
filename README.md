# SHIELD Longevity Platform

## Overview
SHIELD is a full-stack longevity analytics platform with a FastAPI backend and a React frontend. It provides sleep scoring, lab report extraction, actionable suggestions (via OpenAI), and a professional, investor-ready UI.

---

## Architecture
- **Backend:** Python FastAPI REST API
  - Endpoint: `/api/sleep-score` (modular, extensible metric config)
  - Endpoint: `/api/lab-upload` (simulated secure lab report upload)
  - Handles scoring logic, input validation, CORS, and error handling
- **Frontend:** React (TypeScript, PWA-ready)
  - Dashboard widget for user input, score display, alerts, suggestions, and biomarker upload
  - Fetches data from backend API
  - Professional, responsive, and visually impressive UI

---

## Assumptions
- The scoring rules and weights are as described in the prompt and scientific literature
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
- Upload a PDF or image in the "Simulate Secure Lab Report Upload" section to see dummy biomarker extraction

---

## Deployment
- **Backend:** Deployable on any cloud (Render, Heroku, AWS, Azure, etc.) supporting FastAPI/Uvicorn
- **Frontend:** Deployable on Vercel, Netlify, or any static hosting
- For production, set CORS origins and use HTTPS

---

## Features & Improvements
- **Input validation**: All fields are validated for range and required status, with inline error messages
- **Error handling**: API/network/validation errors are shown clearly
- **Modular backend**: Metrics and logic are in a config dict for easy extension
- **Tooltips/descriptions**: Every metric input and card has a tooltip/info icon
- **Suggestions under alerts**: Each alert displays its suggestion directly below
- **Visual feedback**: Color-coded scores, progress bars for metric impact, and a beautiful, professional UI
- **Lab report upload**: Simulated upload with biomarker extraction and display

---

## Simulated Lab Report Upload
- The frontend allows users to upload a PDF or image file as a "lab report"
- The backend `/api/lab-upload` endpoint simulates secure file receipt and returns dummy biomarker data (CRP, Glucose, Vitamin D, LDL)
- In a real system, files would be stored securely, parsed for biomarkers, and access would be audited

---

## ML Integration Plan

### Current State
- The backend uses rule-based scoring for sleep and biomarker extraction from lab reports.
- AI (OpenAI) is used for generating actionable suggestions and summaries.

### ML Expansion Roadmap
1. **Model Training**
   - Collect anonymized user data (sleep, labs, outcomes) with consent.
   - Train ML models (e.g., XGBoost, LightGBM, or deep learning) to predict health risks, biological age, or optimal ranges.
2. **Model Serving**
   - Deploy models as microservices (e.g., using FastAPI, TorchServe, or TensorFlow Serving).
   - Expose endpoints for predictions (e.g., `/api/ml-bioage`, `/api/ml-risk-score`).
3. **Integration with Scoring Logic**
   - When a user submits data, call the ML model endpoint(s) from the scoring service.
   - Combine model outputs (e.g., predicted bio-age, risk probabilities) with rule-based metrics for a composite score.
   - Example: `final_score = 0.7 * rule_score + 0.3 * ml_bioage_score`
   - Use model explanations (e.g., SHAP values) to provide personalized feedback in the UI.
4. **Continuous Learning**
   - Periodically retrain models with new data.
   - Allow users to opt-in for their data to improve the system.

---

## Roadmap for HIPAA-Compliant File Uploads & Secure Storage

1. **Transport Security**
   - Enforce HTTPS for all API endpoints and frontend assets.
   - Use HSTS headers and TLS 1.2+.
2. **Authentication & Authorization**
   - Require user authentication (OAuth2, SSO, or custom JWT) for all uploads and sensitive endpoints.
   - Implement role-based access control (RBAC) for user data.
3. **File Handling**
   - Store uploaded files in encrypted storage (e.g., AWS S3 with SSE, Azure Blob with encryption, or on-prem with LUKS).
   - Never store files on local disk in production; use secure, access-controlled cloud storage.
   - Use signed URLs for temporary access to files.
4. **Data Minimization & Retention**
   - Only retain files as long as necessary for analysis.
   - Allow users to delete their files and data on request.
5. **Audit Logging**
   - Log all file access, uploads, and downloads with user IDs and timestamps.
   - Regularly review logs for suspicious activity.
6. **Compliance & Policies**
   - Sign Business Associate Agreements (BAA) with cloud providers.
   - Conduct regular HIPAA risk assessments and penetration testing.
   - Train staff on HIPAA and data privacy best practices.
7. **User Consent & Transparency**
   - Provide clear consent forms and privacy policies.
   - Allow users to download or delete their data at any time.

---

## Deployment & Testing
- See previous sections for setup, environment variables, and running the backend/frontend.
- For production, ensure all security and compliance steps above are followed.

---

For more details or to contribute, see the codebase or contact the maintainers.
