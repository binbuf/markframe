import { type FC } from 'react';
import { Fab } from 'konsta/react';
import type { ComponentProps } from './index';
import { useNavigateOrOverlay } from './useNavigateOrOverlay';

const KFab: FC<ComponentProps> = ({ node }) => {
  const handleNavigation = useNavigateOrOverlay();
  const navigateTo = node.props?.navigateTo as string | undefined;

  const handleClick = () => handleNavigation(navigateTo);

  const icon = node.props?.icon as string;
  const text = node.props?.text as string;
  const position = node.props?.position as string | undefined;
  const textPosition = (node.props?.textPosition as 'after' | 'before') || 'after';

  const iconEl = icon ? (
    <ion-icon name={icon} style={{ fontSize: '24px' }} />
  ) : undefined;

  if (position) {
    const [horizontal, vertical] = position.split('-');
    const posClassName = `fixed z-50 ${
      horizontal === 'right' ? 'right-4' : 'left-4'
    } ${
      vertical === 'bottom' ? '' : 'top-4'
    }`;

    // When bottom-positioned, account for safe area + tabbar height (set by KSurface)
    const posStyle: React.CSSProperties | undefined = vertical === 'bottom'
      ? { bottom: 'calc(var(--k-safe-area-bottom, 0px) + var(--k-tabbar-height, 0px) + 5px)' }
      : undefined;

    return (
      <Fab
        id={node.props?.id as string}
        className={posClassName}
        style={posStyle}
        icon={iconEl}
        text={text}
        textPosition={textPosition}
        onClick={handleClick}
      />
    );
  }

  return (
    <Fab
      id={node.props?.id as string}
      icon={iconEl}
      text={text}
      textPosition={textPosition}
      onClick={handleClick}
    />
  );
};

KFab.displayName = 'KFab';

export default KFab;
