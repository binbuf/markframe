import { type FC } from 'react';
import type { ComponentProps } from './index';

const KListDivider: FC<ComponentProps> = ({ node }) => {
  const height = (node.props?.height as number) || 1;
  const margin = (node.props?.margin as number) || 0;

  return (
    <div
      className="w-full bg-gray-200 dark:bg-gray-700"
      style={{
        height: `${height}px`,
        marginTop: `${margin}px`,
        marginBottom: `${margin}px`,
      }}
    />
  );
};

KListDivider.displayName = 'KListDivider';

export default KListDivider;
