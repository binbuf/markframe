import { createContext, useContext, useState, type ReactNode } from 'react';

interface OverlayContextType {
  activeOverlays: Set<string>;
  openOverlay: (id: string) => void;
  closeOverlay: (id: string) => void;
  toggleOverlay: (id: string) => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set());

  const openOverlay = (id: string) => {
    setActiveOverlays(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const closeOverlay = (id: string) => {
    setActiveOverlays(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleOverlay = (id: string) => {
    setActiveOverlays(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <OverlayContext.Provider value={{ activeOverlays, openOverlay, closeOverlay, toggleOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}
