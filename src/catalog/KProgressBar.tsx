import { type FC } from 'react';
import type { ComponentProps } from './index';
import { resolveColor } from './colorUtils';

const KProgressBar: FC<ComponentProps> = ({ node }) => {
  const value = (node.props?.value as number) ?? 0;
  const max = (node.props?.max as number) ?? 100;
  const color = (node.props?.color as string) || 'primary';
  const height = (node.props?.height as number) ?? 4;
  const rounded = node.props?.rounded !== false;
  const className = (node.props?.className as string) || '';

  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  // Map common color names to their -500 variant
  const colorMap: Record<string, string> = {
    primary: 'blue-500',
    blue: 'blue-500',
    red: 'red-500',
    green: 'green-500',
    yellow: 'yellow-500',
    orange: 'orange-500',
    purple: 'purple-500',
    pink: 'pink-500',
    indigo: 'indigo-500',
  };

  // Resolve color to Tailwind color name or pass through
  const colorName = colorMap[color] || (color.includes('-') ? color : `${color}-500`);
  const barColorValue = resolveColor(colorName);
  const roundedClass = rounded ? 'rounded-full' : '';

  return (
    <div
      className={`w-full bg-gray-200 overflow-hidden ${roundedClass} ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`h-full ${roundedClass}`}
        style={{ width: `${percent}%`, backgroundColor: barColorValue }}
      />
    </div>
  );
};

KProgressBar.displayName = 'KProgressBar';

export default KProgressBar;
