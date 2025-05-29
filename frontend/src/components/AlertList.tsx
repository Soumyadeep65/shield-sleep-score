import React from 'react';

interface Alert {
  message: string;
  severity: 'info' | 'warning' | 'error';
  suggestion?: string;
}

interface AlertListProps {
  alerts: Alert[];
}

const severityConfig = {
  info: { color: '#1976d2', icon: 'ℹ️' },
  warning: { color: '#ffa000', icon: '⚠️' },
  error: { color: '#d32f2f', icon: '❌' },
};

const AlertList: React.FC<AlertListProps> = ({ alerts }) => (
  <div className="alert-list">
    {alerts.map((alert, idx) => {
      const config = severityConfig[alert.severity] || severityConfig.info;
      return (
        <div
          className="alert-card"
          key={idx}
          style={{
            borderLeft: `6px solid ${config.color}`,
            background: '#fff',
            marginBottom: 18,
            boxShadow: '0 2px 8px 0 rgba(30,42,80,0.08)',
            padding: '16px 18px',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            transition: 'box-shadow 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22, color: config.color }}>{config.icon}</span>
            <span className="alert-message" style={{ color: config.color, fontWeight: 600, fontSize: '1.08rem' }}>{alert.message}</span>
          </div>
          {alert.suggestion && (
            <div
              className="alert-suggestion"
              style={{
                marginLeft: 32,
                marginTop: 4,
                background: '#f1f8e9',
                color: '#388e3c',
                borderRadius: 7,
                padding: '8px 12px',
                fontSize: '1.01rem',
                fontStyle: 'italic',
                boxShadow: '0 1px 4px 0 rgba(67,160,71,0.08)',
                maxWidth: 600,
              }}
            >
              {alert.suggestion}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default AlertList; 