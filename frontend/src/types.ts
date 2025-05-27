export type ApiResponse = {
  shield_score: number;
  bio_age_delta: string;
  alerts: string[];
};

export type SleepFormInput = {
  total_sleep_hours: number;
  sleep_efficiency: number;
  REM_percentage: number;
  age: number;
  sex: string;
}; 