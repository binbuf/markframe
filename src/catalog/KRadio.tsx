import { type FC } from 'react';
import { List, ListItem, Radio } from 'konsta/react';
import type { ComponentProps } from './index';

const KRadio: FC<ComponentProps> = ({ node }) => {
  const label = (node.props?.label as string) || 'Radio';
  const checked = node.props?.checked === true;
  const disabled = node.props?.disabled === true;
  const name = (node.props?.name as string) || 'radio-group';
  const description = node.props?.description as string;

  return (
    <List className="my-0">
      <ListItem
        label
        title={label}
        after={description || undefined}
        media={
          <Radio checked={checked} disabled={disabled} readOnly name={name} />
        }
      />
    </List>
  );
};

KRadio.displayName = 'KRadio';

export default KRadio;
