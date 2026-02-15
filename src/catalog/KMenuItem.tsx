import { type FC } from 'react';
import { MenuListItem } from 'konsta/react';
import type { ComponentProps } from './index';
import { resolveImage } from '../utils/smartAssets';

// Konsta v5 MenuListItem wraps ListItem with ...rest spread, so ListItem props
// (title, text, after, link, target) work at runtime but aren't in the type definitions.
const KMenuItem: FC<ComponentProps> = ({ node }) => {
  const title = (node.props?.title as string) || '';
  const subtitle = node.props?.subtitle as string;
  const active = node.props?.active === true;
  const href = node.props?.href as string;

  const media = node.props?.media as string;
  const resolvedMedia = resolveImage(media, node.id) || media;
  const mediaEl = media ? (
    (resolvedMedia.startsWith('http') || resolvedMedia.startsWith('/')) ? (
      <img src={resolvedMedia} alt="" className="w-5 h-5 object-cover rounded" />
    ) : (
      <ion-icon name={resolvedMedia.replace(/^ion-/, '')} style={{ fontSize: '20px' }} />
    )
  ) : undefined;

  // Props that exist on ListItem but not on MenuListItem's type definition
  const extraProps: Record<string, unknown> = {};
  if (title) extraProps.title = title;
  if (node.props?.text) extraProps.text = node.props.text;
  if (node.props?.after) extraProps.after = node.props.after;
  if (node.props?.link === true) extraProps.link = true;
  if (node.props?.target) extraProps.target = node.props.target;

  return (
    <MenuListItem
      subtitle={subtitle}
      active={active}
      href={href}
      media={mediaEl}
      {...extraProps as any}
    />
  );
};

KMenuItem.displayName = 'KMenuItem';

export default KMenuItem;
