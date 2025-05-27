export type ApiResponse = {
  shield_score: number;
  bio_age_delta: number;
  alerts: string[];
  breakdown: Record<string, {
    value: number | boolean;
    optimal: string;
    impact: number;
  }>;
};

export type SleepFormInput = {
  total_sleep_hours: number;
  sleep_efficiency: number;
  REM_percentage: number;
  age: number;
  sex: string;
  sleep_latency: number;
  hrv: number;
  timing_consistency: number;
  chronotype_alignment: boolean;
}; 