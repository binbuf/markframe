import { type FC } from 'react';
import type { ComponentProps } from './index';

const KCenter: FC<ComponentProps> = ({ node, children }) => {
  const fill = node.props?.fill === true;
  const p = node.props?.p as number | undefined;
  const className = (node.props?.className as string) || '';

  const fillClass = fill ? 'flex-1 h-full min-h-0' : '';
  const paddingClass = p !== undefined ? `p-${p}` : '';

  return (
    <div className={`flex flex-col items-center justify-center ${fillClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

KCenter.displayName = 'KCenter';

export default KCenter;
