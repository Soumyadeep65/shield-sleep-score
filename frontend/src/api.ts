import { API_URL } from './config.ts';
import { SleepFormInput, ApiResponse } from './types';

export async function postSleepScore(input: SleepFormInput): Promise<ApiResponse> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
} 