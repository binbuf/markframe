import React from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import type { ValidationError } from '../utils/validation';

interface ValidationPanelProps {
  errors: ValidationError[];
  warnings: ValidationError[];
  onClose: () => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({ errors, warnings, onClose }) => {
  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#333] shadow-lg z-50 max-h-64 overflow-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#333]">
        <div className="flex items-center gap-3">
          {errors.length > 0 && (
            <div className="flex items-center gap-1 text-red-400">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">{errors.length} error{errors.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {warnings.length > 0 && (
            <div className="flex items-center gap-1 text-yellow-400">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">{warnings.length} warning{warnings.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#383838] rounded text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-3 space-y-1.5">
        {errors.map((error, index) => (
          <div key={`error-${index}`} className="flex items-start gap-2 text-sm">
            <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-mono text-gray-500">{error.path}</span>
              {': '}
              <span className="text-gray-300">{error.message}</span>
            </div>
          </div>
        ))}

        {warnings.map((warning, index) => (
          <div key={`warning-${index}`} className="flex items-start gap-2 text-sm">
            <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-mono text-gray-500">{warning.path}</span>
              {': '}
              <span className="text-gray-300">{warning.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationPanel;
