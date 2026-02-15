import { createContext, useContext } from 'react';

export type NavigateFunction = (surfaceId: string) => void;

const NavigationContext = createContext<NavigateFunction | undefined>(undefined);

export const NavigationProvider = NavigationContext.Provider;

export function useNavigation(): NavigateFunction | undefined {
  return useContext(NavigationContext);
}
