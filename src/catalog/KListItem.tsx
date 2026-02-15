import { type FC, type ReactElement, Children, isValidElement } from 'react';
import { ListItem, Toggle, Checkbox, Radio, Badge } from 'konsta/react';
import type { ComponentProps } from './index';
import { useNavigateOrOverlay } from './useNavigateOrOverlay';
import { resolveImage } from '../utils/smartAssets';
import { badgeColorMap } from './shared';

const EMBED_DISPLAY_NAMES = new Set(['KToggle', 'KCheckbox', 'KRadio']);

const KListItem: FC<ComponentProps> = ({ node, children }) => {
  const handleNavigation = useNavigateOrOverlay();
  const navigateTo = node.props?.navigateTo as string | undefined;
  const childArray = Children.toArray(children);
  
  // Check if children contain a Media component (Icon, Image, or Avatar)
  const mediaChild = childArray.find(
    (child) => isValidElement(child) &&
      ['KIcon', 'KImage', 'KAvatar'].includes((child.type as any)?.displayName)
  );
  const mediaIsAvatar = isValidElement(mediaChild) && (mediaChild.type as any)?.displayName === 'KAvatar';

  // Check if children contain an embeddable control (Switch/Toggle)
  const embedChild = childArray.find(
    (child) => isValidElement(child) && EMBED_DISPLAY_NAMES.has((child.type as any)?.displayName)
  );
  const title = (node.props?.title as string) || '';
  const subtitle = (node.props?.subtitle as string);
  const after = (node.props?.after as string);
  const media = (node.props?.media as string);
  const chevron = node.props?.chevron === true;
  const link = node.props?.link === true;
  const header = node.props?.header === true;
  const divider = node.props?.dividers !== false;
  const strongTitle = node.props?.strongTitle as boolean | 'auto' | undefined;

  const badge = node.props?.badge as string | number | undefined;
  const badgeColor = (node.props?.badgeColor as string) || 'primary';

  if (header) {
    return (
      <ListItem
        groupTitle
        title={title}
      />
    );
  }

  const badgeEl = badge ? (
    <Badge small colors={badgeColorMap[badgeColor] || badgeColorMap.primary}>
      {badge}
    </Badge>
  ) : undefined;

  // Build the after slot: embed control > badge+after > badge > after
  let afterEl: React.ReactNode;
  if (embedChild) {
    const embedEl = embedChild as ReactElement<ComponentProps>;
    const embedName = (embedEl.type as any)?.displayName;
    const embedNode = embedEl.props.node;
    const checked = embedNode.props?.checked === true;
    const disabled = embedNode.props?.disabled === true;
    if (embedName === 'KCheckbox') {
      afterEl = (
        <Checkbox checked={checked} disabled={disabled} readOnly />
      );
    } else if (embedName === 'KRadio') {
      afterEl = (
        <Radio checked={checked} disabled={disabled} readOnly />
      );
    } else {
      afterEl = (
        <Toggle checked={checked} disabled={disabled} readOnly />
      );
    }
  } else if (badge && after) {
    afterEl = (
      <div className="flex items-center gap-2">
        {badgeEl}
        <span>{after}</span>
      </div>
    );
  } else if (badge) {
    afterEl = badgeEl;
  } else {
    afterEl = after;
  }

  const hasSpecialChild = !!mediaChild || !!embedChild;

  return (
    <ListItem
      label={!!embedChild}
      title={title || undefined}
      subtitle={subtitle}
      after={afterEl}
      text={!title && !subtitle ? (children || undefined) : undefined}
      link={link}
      chevron={chevron}
      dividers={divider}
      strongTitle={strongTitle}
      onClick={() => handleNavigation(navigateTo)}
      media={
        media || mediaChild ? (
          mediaIsAvatar ? (
            mediaChild
          ) : (
            <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
              {mediaChild ? (
                mediaChild
              ) : (() => {
                const resolved = resolveImage(media!, node.id) || media!;
                return (resolved.startsWith('http') || resolved.startsWith('/')) ? (
                  <img src={resolved} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ion-icon name={resolved.replace(/^ion-/, '')} style={{ fontSize: '24px' }} />
                );
              })()}
            </div>
          )
        ) : undefined
      }
    >
      {title && children && !hasSpecialChild ? children : undefined}
    </ListItem>
  );
};

export default KListItem;
