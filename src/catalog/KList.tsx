import { type FC } from 'react';
import { List } from 'konsta/react';
import type { ComponentProps } from './index';

const KList: FC<ComponentProps> = ({ node, children }) => {
  const strong = node.props?.strong !== false;
  const full = node.props?.full === true;
  const inset = full ? false : (node.props?.inset !== false);
  const outline = node.props?.outline !== false;
  const dividers = node.props?.dividers !== false;
  const menuList = node.props?.menuList === true;

  return (
    <List
      strong={strong}
      inset={inset}
      outline={outline}
      dividers={dividers}
      menuList={menuList}
    >
      {children}
    </List>
  );
};

KList.displayName = 'KList';

export default KList;
