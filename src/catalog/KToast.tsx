import { type FC, useState, useEffect, useRef } from 'react';
import { Toast } from 'konsta/react';
import type { ComponentProps } from './index';
import { useOverlay } from './OverlayContext';

const KToast: FC<ComponentProps> = ({ node }) => {
  const { activeOverlays, closeOverlay } = useOverlay();
  const text = (node.props?.text as string) || '';
  const position = (node.props?.position as 'left' | 'center' | 'right') || 'center';
  const className = (node.props?.className as string) || '';
  const duration = (node.props?.duration as number) ?? 3000;

  const customId = node.props?.id as string;
  const ids = [node.id, customId].filter(Boolean) as string[];

  // opened=false means hidden until dynamically triggered via overlay system
  const explicitlyHidden = node.props?.opened === false;
  const isDynamicOpen = ids.some(id => activeOverlays.has(id));

  // Track whether the static (auto-show) toast has been auto-dismissed
  const [autoDismissed, setAutoDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Static toasts show on mount then auto-dismiss; dynamic toasts show when triggered
  const opened = isDynamicOpen || (!explicitlyHidden && !autoDismissed);

  useEffect(() => {
    if (opened && duration > 0) {
      timerRef.current = setTimeout(() => {
        setAutoDismissed(true);
        ids.forEach(id => closeOverlay(id));
      }, duration);
      return () => clearTimeout(timerRef.current);
    }
  }, [opened, duration]);

  return (
    <Toast
      opened={opened}
      position={position}
      className={`${className} !bottom-[calc(1rem+var(--k-tabbar-height,0px))]`.trim() || undefined}
    >
      {text}
    </Toast>
  );
};

KToast.displayName = 'KToast';

export default KToast;
