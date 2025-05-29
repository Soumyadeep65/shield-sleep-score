import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface DashboardFormProps {
  onSubmit: (data: DashboardFormData) => void;
  isLoading: boolean;
  apiError?: string;
}

export interface DashboardFormData {
  age: number;
  sex: string;
  sleepHours: number;
  sleepEfficiency: number;
  REMPercentage: number;
  sleepLatency: number;
  hrv: number;
  timingConsistency: number;
  chronotypeAlignment: boolean;
}

const schema = yup.object().shape({
  age: yup.number().typeError('Age is required').min(1, 'Age must be at least 1').max(120, 'Age must be less than 120').required('Age is required'),
  sex: yup.string().oneOf(['male', 'female', 'other']).required('Sex is required'),
  sleepHours: yup.number().typeError('Sleep hours required').min(0.1, 'Sleep hours must be positive').max(24, 'Sleep hours must be less than 24').required('Sleep hours required'),
  sleepEfficiency: yup.number().typeError('Sleep efficiency required').min(0, 'Sleep efficiency must be at least 0').max(100, 'Sleep efficiency must be at most 100').required('Sleep efficiency required'),
  REMPercentage: yup.number().typeError('REM % required').min(0, 'REM % must be at least 0').max(100, 'REM % must be at most 100').required('REM % required'),
  sleepLatency: yup.number().typeError('Sleep latency required').min(0, 'Sleep latency must be at least 0').max(180, 'Sleep latency must be at most 180').required('Sleep latency required'),
  hrv: yup.number().typeError('HRV required').min(1, 'HRV must be positive').max(300, 'HRV must be less than 300').required('HRV required'),
  timingConsistency: yup.number().typeError('Timing consistency required').min(0, 'Timing consistency must be at least 0').max(12, 'Timing consistency must be at most 12').required('Timing consistency required'),
  chronotypeAlignment: yup.boolean().required('Chronotype alignment required'),
});

const DashboardForm: React.FC<DashboardFormProps> = ({ onSubmit, isLoading, apiError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<DashboardFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return (
    <form className="dashboard-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>Age</label>
        <input type="number" {...register('age')} />
        {errors.age && <span className="form-error">{errors.age.message}</span>}
      </div>
      <div className="form-group">
        <label>Sex</label>
        <select {...register('sex')}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.sex && <span className="form-error">{errors.sex.message}</span>}
      </div>
      <div className="form-group">
        <label>Total Sleep Hours (last night)</label>
        <input type="number" step="0.1" {...register('sleepHours')} />
        {errors.sleepHours && <span className="form-error">{errors.sleepHours.message}</span>}
      </div>
      <div className="form-group">
        <label>Sleep Efficiency (%)</label>
        <input type="number" step="0.1" {...register('sleepEfficiency')} />
        {errors.sleepEfficiency && <span className="form-error">{errors.sleepEfficiency.message}</span>}
      </div>
      <div className="form-group">
        <label>REM Sleep (%)</label>
        <input type="number" step="0.1" {...register('REMPercentage')} />
        {errors.REMPercentage && <span className="form-error">{errors.REMPercentage.message}</span>}
      </div>
      <div className="form-group">
        <label>Sleep Latency (min)</label>
        <input type="number" {...register('sleepLatency')} />
        {errors.sleepLatency && <span className="form-error">{errors.sleepLatency.message}</span>}
      </div>
      <div className="form-group">
        <label>HRV (ms)</label>
        <input type="number" {...register('hrv')} />
        {errors.hrv && <span className="form-error">{errors.hrv.message}</span>}
      </div>
      <div className="form-group">
        <label>Timing Consistency (hr)</label>
        <input type="number" step="0.1" {...register('timingConsistency')} />
        {errors.timingConsistency && <span className="form-error">{errors.timingConsistency.message}</span>}
      </div>
      <div className="form-group">
        <label>Chronotype Alignment</label>
        <select {...register('chronotypeAlignment')}>
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {errors.chronotypeAlignment && <span className="form-error">{errors.chronotypeAlignment.message}</span>}
      </div>
      {apiError && <div className="api-error">{apiError}</div>}
      <button type="submit" disabled={isLoading}>{isLoading ? 'Scoring...' : 'Get Score'}</button>
    </form>
  );
};

export default DashboardForm; 