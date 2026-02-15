import { type FC } from 'react';
import { Popup, Navbar, Link } from 'konsta/react';
import type { ComponentProps } from './index';
import { useOverlay } from './OverlayContext';

const KPopup: FC<ComponentProps> = ({ node, children }) => {
  const { activeOverlays, closeOverlay } = useOverlay();
  const backdrop = node.props?.backdrop !== false;
  const closeButton = node.props?.closeButton !== false;
  const title = (node.props?.title as string) || '';

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
    <Popup
      opened={opened}
      backdrop={backdrop}
      onBackdropClick={handleClose}
    >
      {closeButton && (
        <Navbar
          title={title}
          right={<Link onClick={handleClose}>Close</Link>}
        />
      )}
      {children}
    </Popup>
  );
};

KPopup.displayName = 'KPopup';

export default KPopup;
