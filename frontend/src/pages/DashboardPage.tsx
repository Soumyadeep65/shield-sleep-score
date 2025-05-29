import React, { useState } from 'react';
import DashboardForm, { DashboardFormData } from '../components/DashboardForm.tsx';
import ScoreCard from '../components/ScoreCard.tsx';
import DeltaCard from '../components/DeltaCard.tsx';
import MetricBreakdownList from '../components/MetricBreakdownList.tsx';
import AlertList from '../components/AlertList.tsx';
import InfoModal from '../components/InfoModal.tsx';
import { submitSleepScore, SleepScoreRequest, SleepScoreResponse } from '../services/sleepApi.ts';

const metricIcons = { hrv: '💓', total_sleep_hours: '😴', sleep_efficiency: '📈', REM_percentage: '🌙', sleep_latency: '⏱️', timing_consistency: '⏰', chronotype_alignment: '🧬' };

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>(undefined);
  const [showInfo, setShowInfo] = useState(false);
  const [infoContent, setInfoContent] = useState<React.ReactNode>('');
  const [score, setScore] = useState<number | null>(null);
  const [delta, setDelta] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);

  const handleFormSubmit = async (data: DashboardFormData) => {
    setIsLoading(true);
    setApiError(undefined);
    try {
      const req: SleepScoreRequest = {
        total_sleep_hours: data.sleepHours,
        sleep_efficiency: data.sleepEfficiency,
        REM_percentage: data.REMPercentage,
        age: data.age,
        sex: data.sex,
        sleep_latency: data.sleepLatency,
        hrv: data.hrv,
        timing_consistency: data.timingConsistency,
        chronotype_alignment: typeof data.chronotypeAlignment === 'string' ? data.chronotypeAlignment === 'true' : !!data.chronotypeAlignment,
      };
      const res: SleepScoreResponse = await submitSleepScore(req);
      setScore(res.shield_score);
      setDelta(res.bio_age_delta);
      setBreakdown(res.breakdown);
      setAlerts(res.alerts);
    } catch (err: any) {
      setApiError(err.message || 'Failed to get score.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      {isLoading && <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(255,255,255,0.5)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}><div className="loading-spinner" /></div>}
      <h1>Dashboard</h1>
      <DashboardForm onSubmit={handleFormSubmit} isLoading={isLoading} apiError={apiError} />
      {score !== null && (
        <>
          <div className="dashboard-cards-row">
            <ScoreCard score={score} />
            <DeltaCard delta={delta ?? 0} />
          </div>
          <MetricBreakdownList breakdown={breakdown} metricIcons={metricIcons} />
          <AlertList alerts={alerts} />
        </>
      )}
      <button onClick={() => { setShowInfo(true); setInfoContent('Detailed metric info here.'); }}>Show Info</button>
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} title="Metric Info" content={infoContent} />
    </div>
  );
};

export default DashboardPage; 