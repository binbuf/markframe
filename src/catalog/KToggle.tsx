import { type FC } from 'react';
import { List, ListItem, Toggle } from 'konsta/react';
import type { ComponentProps } from './index';

const KToggle: FC<ComponentProps> = ({ node }) => {
  const label = (node.props?.label as string) || 'Toggle';
  const checked = node.props?.checked === true;
  const disabled = node.props?.disabled === true;
  const description = node.props?.description as string;

  return (
    <List className="my-0">
      <ListItem
        label
        title={label}
        after={description || undefined}
      >
        <Toggle
          checked={checked}
          disabled={disabled}
          readOnly
        />
      </ListItem>
    </List>
  );
};

KToggle.displayName = 'KToggle';

export default KToggle;
