import { type FC } from 'react';
import { Sheet } from 'konsta/react';
import type { ComponentProps } from './index';
import { useOverlay } from './OverlayContext';

const KSheet: FC<ComponentProps> = ({ node, children }) => {
  const { activeOverlays, closeOverlay } = useOverlay();
  const backdrop = node.props?.backdrop !== false;
  
  // ID can be the auto-generated node.id OR a custom id prop
  const customId = node.props?.id as string;
  const ids = [node.id, customId].filter(Boolean) as string[];

  const isStaticOpen = node.props?.opened === true;
  const isDynamicOpen = ids.some(id => activeOverlays.has(id));
  const opened = isStaticOpen || isDynamicOpen;

  if (!opened) return null;

  const handleClose = () => {
    ids.forEach(id => closeOverlay(id));
  };

  return (
    <Sheet
      opened={opened}
      backdrop={backdrop}
      onBackdropClick={handleClose}
    >
      {children}
    </Sheet>
  );
};

KSheet.displayName = 'KSheet';

export default KSheet;
