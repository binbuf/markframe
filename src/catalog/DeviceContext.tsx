import { createContext, useContext } from 'react';
import type { DeviceSpec, DeviceOrientation } from '../types/device';

interface DeviceContextValue {
  device: DeviceSpec;
  orientation: DeviceOrientation;
  theme: 'ios' | 'material';
}

const DeviceContext = createContext<DeviceContextValue | undefined>(undefined);

export const DeviceProvider = DeviceContext.Provider;

export function useDevice(): DeviceContextValue {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
}
