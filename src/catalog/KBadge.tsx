import { type FC } from 'react';
import { Badge } from 'konsta/react';
import type { ComponentProps } from './index';
import { badgeColorMap } from './shared';

const KBadge: FC<ComponentProps> = ({ node, children }) => {
  const text = node.props?.text as string | number;
  const color = (node.props?.color as string) || 'primary';
  const small = node.props?.size === 'small';
  const dot = node.props?.dot === true;

  const colors = badgeColorMap[color] || badgeColorMap.primary;

  if (dot) {
    return (
      <Badge small colors={colors} />
    );
  }

  return (
    <Badge
      small={small}
      colors={colors}
    >
      {text ?? children}
    </Badge>
  );
};

KBadge.displayName = 'KBadge';

export default KBadge;
