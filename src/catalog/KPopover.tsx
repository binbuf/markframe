import { type FC, useEffect, useState } from 'react';
import { Popover } from 'konsta/react';
import type { ComponentProps } from './index';
import { useOverlay } from './OverlayContext';

const KPopover: FC<ComponentProps> = ({ node, children }) => {
  const { activeOverlays, closeOverlay } = useOverlay();

  const customId = node.props?.id as string;
  const targetId = node.props?.target as string;

  const ids = [node.id, customId].filter(Boolean) as string[];
  const isStaticOpen = node.props?.opened === true;
  const isDynamicOpen = ids.some(id => activeOverlays.has(id));
  const opened = isStaticOpen || isDynamicOpen;

  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (targetId && opened) {
      const el = document.getElementById(targetId);
      if (el) setTargetEl(el);
    } else {
      setTargetEl(null);
    }
  }, [opened, targetId]);

  const handleClose = () => {
    ids.forEach(id => closeOverlay(id));
  };

  return (
    <Popover
      opened={opened}
      target={targetEl || undefined}
      onBackdropClick={handleClose}
    >
      {children}
    </Popover>
  );
};

KPopover.displayName = 'KPopover';

export default KPopover;
