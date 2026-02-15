import { type FC } from 'react';
import type { ComponentProps } from './index';
import { resolveColor } from './colorUtils';

const KStat: FC<ComponentProps> = ({ node }) => {
  const value = (node.props?.value as string) || '';
  const label = node.props?.label as string | undefined;
  const icon = node.props?.icon as string | undefined;
  const color = node.props?.color as string | undefined;
  const labelColor = node.props?.labelColor as string | undefined;
  const trend = node.props?.trend as string | undefined;
  const className = (node.props?.className as string) || '';

  const trendIsPositive = trend?.startsWith('+');
  const trendColor = trendIsPositive ? 'text-green-500' : 'text-red-500';

  // Inline styles for dynamic colors
  const valueStyle: React.CSSProperties = {};
  if (color) valueStyle.color = resolveColor(color);

  const iconStyle: React.CSSProperties = { fontSize: '24px', marginBottom: '4px' };
  if (color) iconStyle.color = resolveColor(color);

  const labelStyle: React.CSSProperties = {};
  if (labelColor) labelStyle.color = resolveColor(labelColor);

  return (
    <div className={`flex flex-col items-center p-3 flex-1 ${className}`}>
      {icon && (
        <ion-icon
          name={icon}
          style={iconStyle}
        />
      )}
      <span className="text-2xl font-bold" style={valueStyle}>{value}</span>
      {label && (
        <span
          className={`text-xs mt-1 ${labelColor ? '' : 'text-gray-500'}`}
          style={labelStyle}
        >
          {label}
        </span>
      )}
      {trend && <span className={`text-xs font-medium mt-0.5 ${trendColor}`}>{trend}</span>}
    </div>
  );
};

KStat.displayName = 'KStat';

export default KStat;
