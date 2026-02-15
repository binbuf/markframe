import { type FC } from 'react';
import type { ComponentProps } from './index';

const KSpacer: FC<ComponentProps> = ({ node }) => {
  const size = (node.props?.size as number) || 16;
  const grow = node.props?.grow === true;

  if (grow) {
    return <div className="flex-grow" />;
  }

  return (
    <div
      style={{
        height: `${size}px`,
        flexShrink: 0,
      }}
    />
  );
};

KSpacer.displayName = 'KSpacer';

export default KSpacer;
