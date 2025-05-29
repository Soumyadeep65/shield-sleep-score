import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" tabIndex={-1}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">{content}</div>
      </div>
    </div>
  );
};

export default InfoModal; 