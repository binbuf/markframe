import { type ReactNode } from 'react';
import type { MarkframeNode } from '../types/markframe';
import catalog from './index';

export function renderNode(node: MarkframeNode, theme: 'ios' | 'material'): ReactNode {
  try {
    const Component = catalog[node.type];

    if (!Component) {
      return (
        <div
          key={node.id}
          className="border-2 border-red-500 border-dashed p-4 m-2 bg-red-900/20"
        >
          <div className="text-red-400 font-mono text-sm">
            Unknown component: {node.type}
          </div>
          <div className="text-red-500 text-xs mt-1">
            ID: {node.id}
          </div>
        </div>
      );
    }

    const children = (node.children || []).map(child => renderNode(child, theme));
    return <Component key={node.id} node={node} theme={theme}>{children}</Component>;
  } catch (error) {
    console.error(`Error rendering node ${node.id}:`, error);
    return (
      <div
        key={node.id}
        className="border-2 border-red-500 border-dashed p-4 m-2 bg-red-900/20"
      >
        <div className="text-red-400 font-mono text-sm">
          Error rendering: {node.type}
        </div>
        <div className="text-red-500 text-xs mt-1">
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }
}

