import React, { useState } from 'react';

interface Metric {
  value: number | boolean;
  optimal: string;
  impact: number;
  label: string;
  help: string;
  icon?: string;
}

interface MetricBreakdownListProps {
  breakdown: Record<string, Metric>;
  metricIcons: Record<string, string>;
}

const MetricBreakdownList: React.FC<MetricBreakdownListProps> = ({ breakdown, metricIcons }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="metrics-breakdown">
      {Object.entries(breakdown).map(([key, value]) => {
        const v = value as Metric;
        return (
          <div className="metric-card" key={key}>
            <div className="metric-title">
              <span className="metric-icon">{metricIcons[key] || ''}</span> {v.label}
              <span
                className="metric-help"
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                style={{ position: 'relative' }}
              >
                ?
                {hovered === key && (
                  <span className="custom-tooltip" style={{ position: 'absolute', left: 24, top: -8, background: '#1976d2', color: '#fff', borderRadius: 6, padding: '8px 12px', fontSize: '0.98rem', zIndex: 10, whiteSpace: 'pre-line', minWidth: 180 }}>
                    {v.help}
                  </span>
                )}
              </span>
            </div>
            <div className="metric-value">{String(v.value)}</div>
            <div className="metric-opt">Optimal: {v.optimal}</div>
            <div className="metric-impact">Impact:
              <span style={{ color: v.impact > 0 ? '#d32f2f' : '#43a047', marginLeft: 4 }}>{v.impact}</span>
              <div className="progress-bar-bg">
                <div className="progress-bar" style={{ width: `${Math.min(100, v.impact * 100)}%`, background: v.impact > 0 ? '#d32f2f' : '#43a047' }}></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricBreakdownList; 