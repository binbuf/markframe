import { type FC } from 'react';
import type { ComponentProps } from './index';

const KGrid: FC<ComponentProps> = ({ node, children }) => {
  const cols = (node.props?.cols as number) ?? 2;
  const rows = node.props?.rows as number | undefined;
  const gap = (node.props?.gap as number) ?? 4;
  const p = node.props?.p as number | undefined;
  const className = (node.props?.className as string) || '';

  const paddingClass = p !== undefined ? `p-${p}` : '';
  const rowsStyle = rows ? `grid-rows-${rows}` : '';

  return (
    <div
      className={`grid ${rowsStyle} ${paddingClass} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
};

KGrid.displayName = 'KGrid';

export default KGrid;
