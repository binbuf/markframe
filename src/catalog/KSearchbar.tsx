import { type FC } from 'react';
import { Searchbar } from 'konsta/react';
import type { ComponentProps } from './index';

const KSearchbar: FC<ComponentProps> = ({ node }) => {
  const placeholder = (node.props?.placeholder as string) || 'Search';
  const value = node.props?.value as string;
  const className = (node.props?.className as string) || '';
  const clearButton = node.props?.clearButton !== false;
  const disableButton = node.props?.disableButton === true;

  return (
    <Searchbar
      placeholder={placeholder}
      value={value}
      className={className}
      clearButton={clearButton}
      disableButton={disableButton}
    />
  );
};

KSearchbar.displayName = 'KSearchbar';

export default KSearchbar;
