import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarMetricsChartProps {
  data: { metric: string; value: number; icon?: string }[];
}

const RadarMetricsChart: React.FC<RadarMetricsChartProps> = ({ data }) => (
  <div className="radar-card">
    <div className="radar-label">Metrics vs. Optimal</div>
    <ResponsiveContainer width={180} height={180}>
      <RadarChart cx="50%" cy="50%" outerRadius={70} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} />
        <Radar name="You" dataKey="value" stroke="#1976d2" fill="#1976d2" fillOpacity={0.5} isAnimationActive={true} />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

export default RadarMetricsChart; 