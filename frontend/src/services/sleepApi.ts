import axios from 'axios';

// TODO: Replace with environment variable if needed (see README for Vite/CRA setup)
const API_BASE = 'http://localhost:8000/api';

export interface SleepScoreRequest {
  total_sleep_hours: number;
  sleep_efficiency: number;
  REM_percentage: number;
  age: number;
  sex: string;
  sleep_latency: number;
  hrv: number;
  timing_consistency: number;
  chronotype_alignment: boolean;
}

export interface SleepScoreResponse {
  shield_score: number;
  bio_age_delta: number;
  alerts: string[];
  breakdown: Record<string, any>;
}

export async function submitSleepScore(data: SleepScoreRequest): Promise<SleepScoreResponse> {
  try {
    const res = await axios.post(
      `${API_BASE}/sleep-score`,
      data,
      { timeout: 60000 }
    );
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.detail) {
      throw new Error(err.response.data.detail);
    }
    throw new Error('Failed to submit sleep score.');
  }
} 