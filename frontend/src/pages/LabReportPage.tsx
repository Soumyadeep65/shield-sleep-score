import React, { useState } from 'react';
import LabUploadForm from '../components/LabUploadForm.tsx';
import LabResults from '../components/LabResults.tsx';
import { uploadLabReport, LabUploadResponse } from '../services/labApi.ts';
// TODO: Import modular lab upload and results components here

const mockBiomarkers = [
  { name: 'Glucose', value: 92, referenceRange: '70-99' },
  { name: 'CRP', value: 1.2, referenceRange: '<3.0' },
  { name: 'LDL', value: 110, referenceRange: '<100' },
];

const LabReportPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>(undefined);
  const [biomarkers, setBiomarkers] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string>('');

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setApiError(undefined);
    try {
      const res: LabUploadResponse = await uploadLabReport(file);
      setBiomarkers(
        Object.entries(res.biomarkers).map(([name, value]: [string, any]) => ({
          name,
          value: value.value,
          unit: value.unit,
          referenceRange: value.ref_low && value.ref_high
            ? `${value.ref_low}-${value.ref_high} ${value.unit || ''}`
            : value.ref_low
              ? `≥${value.ref_low} ${value.unit || ''}`
              : value.ref_high
                ? `≤${value.ref_high} ${value.unit || ''}`
                : '',
          status: value.status || '',
        }))
      );
      setSuggestions(res.suggestions || '');
    } catch (err: any) {
      setApiError(err.message || 'Failed to extract biomarkers.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lab-report-page">
      {isLoading && <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(255,255,255,0.5)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}><div className="loading-spinner" /></div>}
      <h1>Lab Report Upload & Biomarker Visualization</h1>
      <LabUploadForm onUpload={handleUpload} isLoading={isLoading} apiError={apiError} />
      <LabResults biomarkers={biomarkers} />
      {suggestions && (
        <div className="lab-suggestions" style={{marginTop: 32, background: '#f9fbfd', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px 0 rgba(30,42,80,0.06)'}}>
          <h3 style={{color: '#1976d2'}}>AI Suggestions</h3>
          <div style={{whiteSpace: 'pre-line', fontSize: '1.08rem'}}>{suggestions}</div>
        </div>
      )}
    </div>
  );
};

export default LabReportPage; 