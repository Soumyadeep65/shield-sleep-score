import axios from 'axios';

// TODO: Replace with environment variable if needed (see README for Vite/CRA setup)
const API_BASE = 'http://localhost:8000/api';

export interface LabUploadResponse {
  filename: string;
  biomarkers: Record<string, any>; // nested object
  suggestions: string;
  message: string;
}

export async function uploadLabReport(file: File): Promise<LabUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await axios.post(
      `${API_BASE}/lab-upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      }
    );
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.detail) {
      throw new Error(err.response.data.detail);
    }
    throw new Error('Failed to upload lab report.');
  }
} 