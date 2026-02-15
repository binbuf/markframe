import { type FC } from 'react';
import { Preloader } from 'konsta/react';
import type { ComponentProps } from './index';

const KPreloader: FC<ComponentProps> = ({ node }) => {
  const size = (node.props?.size as number) ?? 32;
  const className = (node.props?.className as string) || '';

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Preloader />
    </div>
  );
};

KPreloader.displayName = 'KPreloader';

export default KPreloader;
