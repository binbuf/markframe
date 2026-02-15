import React, { useState } from 'react';
import { FilePlus, FolderOpen, X } from 'lucide-react';
import { blueprints } from '../blueprints';

interface WelcomeScreenProps {
  onNewProject: (data?: string) => void;
  onOpenFile: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNewProject, onOpenFile }) => {
  const [showBlueprints, setShowBlueprints] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900 text-slate-200 relative">
      <div className="max-w-md w-full p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 text-center">
        {/* Logo / Header */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4">
            <img src="app.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">markframe</h1>
          <p className="text-slate-400">Declarative mobile UI, instantly previewed.</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => setShowBlueprints(true)}
            className="w-full group relative flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            <FilePlus size={20} />
            New Project
          </button>
          
          <button
            onClick={onOpenFile}
            className="w-full group relative flex items-center justify-center gap-3 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all border border-slate-600 hover:border-slate-500 active:scale-[0.98]"
          >
            <FolderOpen size={20} />
            Open File
          </button>
        </div>
      </div>

      {/* Blueprint Picker Modal */}
      {showBlueprints && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col animation-fade-in-up">
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
              <h2 className="text-lg font-semibold text-white">Choose a Blueprint</h2>
              <button 
                onClick={() => setShowBlueprints(false)} 
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2">
              {blueprints.map((bp) => (
                <button
                  key={bp.name}
                  onClick={() => onNewProject(bp.data)}
                  className="w-full text-left p-4 rounded-lg border border-slate-700 bg-slate-700/30 hover:bg-slate-700 hover:border-blue-500/50 transition-all group"
                >
                  <div className="font-medium text-white group-hover:text-blue-400 transition-colors">{bp.name}</div>
                  <div className="text-sm text-slate-400 mt-1">{bp.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
