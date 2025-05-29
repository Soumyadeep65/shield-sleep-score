export type ApiResponse = {
  shield_score: number;
  bio_age_delta: number;
  alerts: string[];
  breakdown: Record<string, {
    value: number | boolean;
    optimal: string;
    impact: number;
    label: string;
    help: string;
  }>;
};

export type SleepFormInput = {
  total_sleep_hours: string | number;
  sleep_efficiency: string | number;
  REM_percentage: string | number;
  age: string | number;
  sex: string;
  sleep_latency: string | number;
  hrv: string | number;
  timing_consistency: string | number;
  chronotype_alignment: boolean;
};

export type BiomarkerResponse = {
  filename: string;
  biomarkers: Record<string, number>;
  message: string;
}; 