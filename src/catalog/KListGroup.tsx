import { type FC } from 'react';
import { List, BlockTitle } from 'konsta/react';
import type { ComponentProps } from './index';

const KListGroup: FC<ComponentProps> = ({ node, children }) => {
  const title = (node.props?.title as string);
  const strong = node.props?.strong !== false;
  const inset = node.props?.inset !== false;
  const outline = node.props?.outline !== false;

  return (
    <div className="my-4">
      {title && (
        <BlockTitle className="mt-6 mb-2">
          {title}
        </BlockTitle>
      )}
      <List
        strong={strong}
        inset={inset}
        outline={outline}
      >
        {children}
      </List>
    </div>
  );
};

KListGroup.displayName = 'KListGroup';

export default KListGroup;
