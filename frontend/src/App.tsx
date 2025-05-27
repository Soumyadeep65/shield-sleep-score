import React, { useState } from 'react';
import './App.css';
import { alertSuggestions } from './suggestions.ts';
import { postSleepScore } from './api.ts';
import { ApiResponse, SleepFormInput } from './types';

// Default form input values
const defaultInput: SleepFormInput = {
  total_sleep_hours: 6.5,
  sleep_efficiency: 88,
  REM_percentage: 16,
  age: 45,
  sex: 'male',
};

function App() {
  const [input, setInput] = useState<SleepFormInput>(defaultInput);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: name === 'sex' ? value : Number(value),
    }));
  };

  // Handle form submit
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

  return (
    <div className="dashboard-widget">
      <h2>SHIELD Sleep Score</h2>
      <form className="input-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Total Sleep Hours:
            <input type="number" step="0.1" min="0" max="24" name="total_sleep_hours" value={input.total_sleep_hours} onChange={handleChange} required />
          </label>
          <label>Sleep Efficiency (%):
            <input type="number" step="0.1" min="0" max="100" name="sleep_efficiency" value={input.sleep_efficiency} onChange={handleChange} required />
          </label>
        </div>
        <div className="form-row">
          <label>REM %:
            <input type="number" step="0.1" min="0" max="100" name="REM_percentage" value={input.REM_percentage} onChange={handleChange} required />
            <span className="tooltip">?
              <span className="tooltiptext">REM % is the percentage of your total sleep spent in Rapid Eye Movement (REM) sleep. Typical healthy range: 15-25%.</span>
            </span>
          </label>
          <label>Age:
            <input type="number" min="0" max="120" name="age" value={input.age} onChange={handleChange} required />
          </label>
          <label>Sex:
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
        <div className="results">
          <div className="score">Score: <span>{result.shield_score}</span></div>
          <div className="bio-age">Bio-Age Change: <span>{result.bio_age_delta}</span></div>
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
    </div>
  );
}

export default App;
