import React, { useRef } from 'react';

interface LabUploadFormProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
  apiError?: string;
}

const LabUploadForm: React.FC<LabUploadFormProps> = ({ onUpload, isLoading, apiError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      onUpload(e.target.files[0]);
    }
  };

  return (
    <form className="lab-upload-form" onSubmit={e => e.preventDefault()}>
      <label className="upload-label">
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className={`upload-btn${isLoading ? ' loading' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Lab PDF'}
        </button>
        {fileName && <span className="file-name">{fileName}</span>}
      </label>
      {apiError && <div className="api-error">{apiError}</div>}
    </form>
  );
};

export default LabUploadForm; 