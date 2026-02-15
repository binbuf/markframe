import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { KEYBOARD_SHORTCUTS, formatShortcut } from '../constants/shortcuts';

interface ShortcutsDialogProps {
  onClose: () => void;
}

const ShortcutsDialog: React.FC<ShortcutsDialogProps> = ({ onClose }) => {
  const categories = Array.from(new Set(KEYBOARD_SHORTCUTS.map(s => s.category)));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#2d2d2d] rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-[#444]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#444]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#383838] rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-auto max-h-[calc(80vh-120px)]">
          {categories.map(category => (
            <div key={category} className="mb-5 last:mb-0">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {category}
              </h3>
              <div className="space-y-1">
                {KEYBOARD_SHORTCUTS.filter(s => s.category === category).map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1.5 px-3 rounded hover:bg-[#383838]"
                  >
                    <span className="text-sm text-gray-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2.5 py-0.5 bg-[#1e1e1e] border border-[#444] rounded font-mono text-xs text-gray-300">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#444] bg-[#252525]">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-[#1e1e1e] border border-[#444] rounded font-mono text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsDialog;
