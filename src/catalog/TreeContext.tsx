import { createContext, useContext, type ReactNode } from 'react';
import type { MarkframeNode } from '../types/markframe';

type TreeMap = Map<string, MarkframeNode> | null;

const TreeContext = createContext<TreeMap>(null);

export function TreeProvider({ tree, children }: { tree: TreeMap; children: ReactNode }) {
  return (
    <TreeContext.Provider value={tree}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTree(): TreeMap {
  return useContext(TreeContext);
}
