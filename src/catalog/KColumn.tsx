import { type FC } from 'react';
import type { ComponentProps } from './index';

// Static lookup maps for column alignment and justification
const alignClass: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClass: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const KColumn: FC<ComponentProps> = ({ node, children }) => {
  const gap = (node.props?.gap as number) || 0;
  const align = (node.props?.align as string) || 'stretch';
  const justify = (node.props?.justify as string) || 'start';
  const className = (node.props?.className as string) || '';

  // New enriched props
  const p = node.props?.p as number | undefined;
  const px = node.props?.px as number | undefined;
  const py = node.props?.py as number | undefined;
  const pt = node.props?.pt as number | undefined;
  const pb = node.props?.pb as number | undefined;
  const pl = node.props?.pl as number | undefined;
  const pr = node.props?.pr as number | undefined;
  const mx = node.props?.mx as number | undefined;
  const fill = node.props?.fill === true;
  const mt = node.props?.mt as number | undefined;
  const mb = node.props?.mb as number | undefined;

  // Build enriched classes
  const enriched: string[] = [];
  if (p !== undefined) enriched.push(`p-${p}`);
  if (px !== undefined) enriched.push(`px-${px}`);
  if (py !== undefined) enriched.push(`py-${py}`);
  if (pt !== undefined) enriched.push(`pt-${pt}`);
  if (pb !== undefined) enriched.push(`pb-${pb}`);
  if (pl !== undefined) enriched.push(`pl-${pl}`);
  if (pr !== undefined) enriched.push(`pr-${pr}`);
  if (mx !== undefined) enriched.push(`mx-${mx}`);
  if (fill) enriched.push('flex-1');
  const enrichedClass = enriched.join(' ');

  // Build inline styles (use for dynamic margin values to prevent Tailwind JIT issues)
  // mt/mb values are in Tailwind spacing scale (1 unit = 0.25rem)
  const style: React.CSSProperties = {};
  if (gap) style.gap = `${gap}px`;
  if (mt !== undefined) style.marginTop = `${mt * 0.25}rem`;
  if (mb !== undefined) style.marginBottom = `${mb * 0.25}rem`;

  return (
    <div
      className={`flex flex-col ${alignClass[align] || 'items-stretch'} ${justifyClass[justify] || 'justify-start'} ${enrichedClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

KColumn.displayName = 'KColumn';

export default KColumn;
