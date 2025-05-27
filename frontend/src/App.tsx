import React, { useState } from 'react';
import './App.css';
import { alertSuggestions } from './suggestions.ts';
import { postSleepScore } from './api.ts';
import { ApiResponse, SleepFormInput } from './types.ts';

const defaultInput: SleepFormInput = {
  total_sleep_hours: 7.5,
  sleep_efficiency: 90,
  REM_percentage: 22,
  age: 35,
  sex: 'male',
  sleep_latency: 15,
  hrv: 60,
  timing_consistency: 0.5,
  chronotype_alignment: true,
};

const metricLabels: Record<string, string> = {
  hrv: 'HRV (ms)',
  total_sleep_hours: 'Total Sleep Time (hrs)',
  sleep_efficiency: 'Sleep Efficiency (%)',
  REM_percentage: 'REM Sleep (%)',
  sleep_latency: 'Sleep Latency (min)',
  timing_consistency: 'Timing Consistency (hr)',
  chronotype_alignment: 'Chronotype Alignment',
};

const metricHelp: Record<string, string> = {
  hrv: 'Heart Rate Variability. Higher is better. >50ms is optimal.',
  total_sleep_hours: 'Total hours of sleep per night. 7–8.5 hours is optimal.',
  sleep_efficiency: 'Percent of time in bed spent asleep. ≥85% is optimal.',
  REM_percentage: 'Percent of sleep spent in REM. 20–25% is optimal.',
  sleep_latency: 'Minutes it takes to fall asleep. <20 min is optimal.',
  timing_consistency: 'Variation in sleep timing (bed/wake) across days. <1hr is optimal.',
  chronotype_alignment: 'Is your sleep schedule aligned with your natural preference? (Yes/No)',
};

function App() {
  const [input, setInput] = useState<SleepFormInput>(defaultInput);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'sex' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await postSleepScore(input);
      setResult(data);
    } catch (err) {
      setError('Failed to fetch score. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const getDeltaColor = (delta: number) => {
    if (delta < 0) return '#43a047'; // green
    if (delta < 1) return '#ffa000'; // yellow
    return '#d32f2f'; // red
  };

  return (
    <div className="dashboard-widget pro-ui">
      <div className="header-row">
        <h2>SHIELD Sleep & Longevity Dashboard</h2>
        <button className="info-btn" onClick={() => setShowInfo(true)}>What is this?</button>
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Total Sleep Hours
            <input type="number" step="0.1" min="0" max="24" name="total_sleep_hours" value={input.total_sleep_hours} onChange={handleChange} required />
          </label>
          <label>Sleep Efficiency (%)
            <input type="number" step="0.1" min="0" max="100" name="sleep_efficiency" value={input.sleep_efficiency} onChange={handleChange} required />
          </label>
          <label>REM %
            <input type="number" step="0.1" min="0" max="100" name="REM_percentage" value={input.REM_percentage} onChange={handleChange} required />
          </label>
        </div>
        <div className="form-row">
          <label>Sleep Latency (min)
            <input type="number" step="1" min="0" max="180" name="sleep_latency" value={input.sleep_latency} onChange={handleChange} required />
          </label>
          <label>HRV (ms)
            <input type="number" step="1" min="0" max="300" name="hrv" value={input.hrv} onChange={handleChange} required />
          </label>
          <label>Timing Consistency (hr)
            <input type="number" step="0.01" min="0" max="12" name="timing_consistency" value={input.timing_consistency} onChange={handleChange} required />
          </label>
        </div>
        <div className="form-row">
          <label>Chronotype Alignment
            <select name="chronotype_alignment" value={input.chronotype_alignment ? 'true' : 'false'} onChange={e => setInput(prev => ({ ...prev, chronotype_alignment: e.target.value === 'true' }))} required>
              <option value="true">Aligned</option>
              <option value="false">Not aligned</option>
            </select>
          </label>
          <label>Age
            <input type="number" min="0" max="120" name="age" value={input.age} onChange={handleChange} required />
          </label>
          <label>Sex
            <select name="sex" value={input.sex} onChange={handleChange} required>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Calculating...' : 'Get Score'}</button>
      </form>
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="results pro-results">
          <div className="summary-cards">
            <div className="score-card">
              <div className="score-label">SHIELD Sleep Score</div>
              <div className="score-value">{result.shield_score}</div>
            </div>
            <div className="delta-card" style={{ borderColor: getDeltaColor(result.bio_age_delta) }}>
              <div className="delta-label">Bio-Age Delta</div>
              <div className="delta-value" style={{ color: getDeltaColor(result.bio_age_delta) }}>
                {result.bio_age_delta > 0 ? '+' : ''}{result.bio_age_delta} yrs
              </div>
            </div>
          </div>
          <div className="metrics-breakdown">
            {Object.entries(result.breakdown).map(([key, val]) => {
              const v = val as { value: number | boolean; optimal: string; impact: number };
              return (
                <div className="metric-card" key={key}>
                  <div className="metric-title">{metricLabels[key] || key}
                    <span className="metric-help" title={metricHelp[key] || ''}>?</span>
                  </div>
                  <div className="metric-value">{String(v.value)}</div>
                  <div className="metric-opt">Optimal: {v.optimal}</div>
                  <div className="metric-impact">Impact: <span style={{ color: v.impact > 0 ? '#d32f2f' : '#43a047' }}>{v.impact}</span></div>
                </div>
              );
            })}
          </div>
          <div className="alerts">
            <h4>System Alerts</h4>
            {result.alerts.length === 0 ? <div className="ok">No alerts. Great job!</div> : (
              <ul>
                {result.alerts.map(alert => (
                  <li key={alert}>
                    <strong>{alert}</strong>
                    {alertSuggestions[alert] && (
                      <div className="suggestion">Suggestion: {alertSuggestions[alert]}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>What is the SHIELD Sleep & Longevity Dashboard?</h3>
            <p>This dashboard uses validated sleep and recovery metrics, weighted by their scientific impact on biological aging, to estimate your SHIELD Sleep Score and how your sleep is affecting your biological age (Bio-Age Delta). Metrics are compared to optimal ranges from peer-reviewed research. The lower your Bio-Age Delta, the better for your longevity!</p>
            <button onClick={() => setShowInfo(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
