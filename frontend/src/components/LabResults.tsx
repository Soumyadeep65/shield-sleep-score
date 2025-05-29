import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Biomarker {
  name: string;
  value: number;
  referenceRange: string;
}

interface LabResultsProps {
  biomarkers: Biomarker[];
}

const LabResults: React.FC<LabResultsProps> = ({ biomarkers }) => (
  <div className="lab-results">
    <h3>Extracted Biomarkers</h3>
    <div className="biomarker-list">
      {biomarkers.map((b, idx) => (
        <div className="biomarker-card" key={idx}>
          <div className="biomarker-name">{b.name}</div>
          <div className="biomarker-value">{b.value}</div>
          <div className="biomarker-ref">Ref: {b.referenceRange}</div>
        </div>
      ))}
    </div>
    <div className="biomarker-chart">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={biomarkers} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1976d2" isAnimationActive={true} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default LabResults; 