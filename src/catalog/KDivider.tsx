import { type FC } from 'react';
import type { ComponentProps } from './index';

// Static color map for divider colors
const colorClasses: Record<string, string> = {
  gray: 'bg-black/10 dark:bg-white/10',
  primary: 'bg-primary',
  blue: 'bg-primary',
  red: 'bg-red-600 dark:bg-red-500',
  green: 'bg-green-600 dark:bg-green-500',
};

const KDivider: FC<ComponentProps> = ({ node }) => {
  const orientation = (node.props?.orientation as string) || 'horizontal';
  const color = (node.props?.color as string) || 'gray';
  const thickness = (node.props?.thickness as number) || 1;
  const spacing = (node.props?.spacing as number) || 16;
  const inset = node.props?.inset === true;
  const widthProp = node.props?.width as string | number | undefined;

  const bgColor = colorClasses[color] || colorClasses.gray;

  if (orientation === 'vertical') {
    return (
      <div
        className={bgColor}
        style={{
          width: `${thickness}px`,
          height: '100%',
          marginLeft: `${spacing}px`,
          marginRight: `${spacing}px`,
        }}
      />
    );
  }

  return (
    <div
      className={`${bgColor} ${inset ? 'ml-4' : ''}`}
      style={{
        height: `${thickness}px`,
        width: widthProp !== undefined ? (typeof widthProp === 'number' ? `${widthProp}px` : widthProp) : '100%',
        marginTop: `${spacing}px`,
        marginBottom: `${spacing}px`,
      }}
    />
  );
};

KDivider.displayName = 'KDivider';

export default KDivider;
