import React from 'react';

interface ScoreCardProps {
  score: number;
  color?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, color = '#1976d2' }) => {
  const percent = Math.max(0, Math.min(100, score));
  return (
    <div className="score-card" style={{ borderColor: color }}>
      <div className="score-label">SHIELD Sleep Score</div>
      <div className="score-circular">
        <svg width="90" height="90">
          <circle cx="45" cy="45" r="40" stroke="#e3eaf2" strokeWidth="10" fill="none" />
          <circle
            cx="45" cy="45" r="40"
            stroke={color}
            strokeWidth="10" fill="none"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (percent / 100) * 251.2}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)' }}
          />
          <text x="50%" y="54%" textAnchor="middle" fontSize="2rem" fill={color} fontWeight="bold">{score}</text>
        </svg>
      </div>
    </div>
  );
};

export default ScoreCard; 