import { type FC } from 'react';
import { Panel } from 'konsta/react';
import type { ComponentProps } from './index';
import { useOverlay } from './OverlayContext';

const KPanel: FC<ComponentProps> = ({ node, children }) => {
  const { activeOverlays, closeOverlay } = useOverlay();
  
  const customId = node.props?.id as string;
  const ids = [node.id, customId].filter(Boolean) as string[];

  const isStaticOpen = node.props?.opened === true;
  const isDynamicOpen = ids.some(id => activeOverlays.has(id));
  const opened = isStaticOpen || isDynamicOpen;

  if (!opened) return null;

  const side = (node.props?.side as 'left' | 'right') || 'left';
  const sizeClass = (node.props?.size as string) || 'w-72';
  const floating = node.props?.floating === true;
  const className = (node.props?.className as string) || '';

  const handleClose = () => {
    ids.forEach(id => closeOverlay(id));
  };

  return (
    <Panel
      side={side}
      opened={opened}
      onBackdropClick={handleClose}
      className={`${sizeClass} ${className}`.trim()}
      floating={floating}
    >
        {children}
    </Panel>
  );
};

KPanel.displayName = 'KPanel';

export default KPanel;
