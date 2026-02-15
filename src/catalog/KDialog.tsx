import { type FC } from 'react';
import { Dialog, DialogButton } from 'konsta/react';
import type { ComponentProps } from './index';
import { useOverlay } from './OverlayContext';

const KDialog: FC<ComponentProps> = ({ node }) => {
  const { activeOverlays, closeOverlay } = useOverlay();
  const title = (node.props?.title as string) || '';
  const content = (node.props?.content as string) || '';

  const customId = node.props?.id as string;
  const ids = [node.id, customId].filter(Boolean) as string[];

  const isStaticOpen = node.props?.opened === true;
  const isDynamicOpen = ids.some(id => activeOverlays.has(id));
  const opened = isStaticOpen || isDynamicOpen;

  if (!opened) return null;

  const handleClose = () => {
    ids.forEach(id => closeOverlay(id));
  };

  // Build buttons from child DialogButton nodes (markframe pattern) or from buttons prop
  const buttonChildren = (node.children || []).filter(c => c.type === 'DialogButton');
  const buttons = buttonChildren.length > 0
    ? buttonChildren.map(c => ({
        label: (c.props?.label as string) || '',
        destructive: c.props?.destructive === true,
        strong: c.props?.strong === true || c.props?.bold === true,
      }))
    : (node.props?.buttons as { label: string; destructive?: boolean; strong?: boolean }[]) || [
        { label: 'Cancel' },
        { label: 'OK', strong: true },
      ];

  return (
    <Dialog
      opened={opened}
      onBackdropClick={handleClose}
      title={title}
      content={content}
      buttons={
        <>
          {buttons.map((button, index) => (
            <DialogButton
              key={index}
              strong={button.strong}
              className={button.destructive ? 'k-color-red text-red-500' : ''}
              onClick={handleClose}
            >
              {button.label}
            </DialogButton>
          ))}
        </>
      }
    />
  );
};

KDialog.displayName = 'KDialog';

export default KDialog;

