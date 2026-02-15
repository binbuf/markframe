import { type FC } from 'react';
import type { ComponentProps } from './index';
import { resolveColor } from './colorUtils';

const KIconCircle: FC<ComponentProps> = ({ node }) => {
  const icon = (node.props?.icon as string) || 'ellipse';
  const label = node.props?.label as string | undefined;
  const color = (node.props?.color as string) || 'gray';
  const bg = node.props?.bg as string | undefined;
  const size = (node.props?.size as number) ?? 64;
  const iconSize = (node.props?.iconSize as number) ?? Math.round(size * 0.5);
  const className = (node.props?.className as string) || '';

  // Default background to {color}-100 if not specified
  const bgValue = bg || `${color}-100`;
  const backgroundColor = resolveColor(bgValue);
  const colorValue = color;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className="rounded-full flex items-center justify-center shrink-0"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor
        }}
      >
        <ion-icon
          name={icon}
          style={{ fontSize: `${iconSize}px`, color: colorValue }}
        />
      </div>
      {label && <span className="text-xs text-center">{label}</span>}
    </div>
  );
};

KIconCircle.displayName = 'KIconCircle';

export default KIconCircle;
