import { type FC } from 'react';
import { List, ListItem, Checkbox } from 'konsta/react';
import type { ComponentProps } from './index';

const KCheckbox: FC<ComponentProps> = ({ node }) => {
  const label = (node.props?.label as string) || 'Checkbox';
  const checked = node.props?.checked === true;
  const disabled = node.props?.disabled === true;
  const description = node.props?.description as string;

  return (
    <List className="my-0">
      <ListItem
        label
        title={label}
        after={description || undefined}
        media={
          <Checkbox checked={checked} disabled={disabled} readOnly />
        }
      />
    </List>
  );
};

KCheckbox.displayName = 'KCheckbox';

export default KCheckbox;
