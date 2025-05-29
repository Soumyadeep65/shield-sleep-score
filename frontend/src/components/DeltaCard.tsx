import React from 'react';

interface DeltaCardProps {
  delta: number;
  color?: string;
}

const DeltaCard: React.FC<DeltaCardProps> = ({ delta, color = '#43a047' }) => (
  <div className="delta-card" style={{ borderColor: color }}>
    <div className="delta-label">Bio-Age Delta</div>
    <div className="delta-value" style={{ color }}>
      {delta > 0 ? '+' : ''}{delta} yrs
    </div>
  </div>
);

export default DeltaCard; 