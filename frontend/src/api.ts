import { API_URL } from './config.ts';
import { SleepFormInput, ApiResponse, BiomarkerResponse } from './types';

export async function postSleepScore(input: SleepFormInput): Promise<ApiResponse> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function uploadLabReport(file: File): Promise<BiomarkerResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(API_URL.replace('/sleep-score', '/lab-upload'), {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Lab upload failed');
  return res.json();
} 