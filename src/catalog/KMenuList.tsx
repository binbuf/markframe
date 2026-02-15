import { type FC } from 'react';
import { MenuList } from 'konsta/react';
import type { ComponentProps } from './index';

// Konsta v5 MenuList wraps List with ...rest spread, so List props
// (outline, strong, inset) work at runtime but aren't in the type definitions.
const KMenuList: FC<ComponentProps> = ({ node, children }) => {
  const className = (node.props?.className as string) || '';

  const extraProps: Record<string, unknown> = {};
  if (node.props?.outline === true) extraProps.outline = true;
  if (node.props?.strong === true) extraProps.strong = true;
  if (node.props?.inset === true) extraProps.inset = true;

  return (
    <MenuList className={className} {...extraProps as any}>
      {children}
    </MenuList>
  );
};

KMenuList.displayName = 'KMenuList';

export default KMenuList;
