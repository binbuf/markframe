import { type FC } from 'react';
import { Toolbar } from 'konsta/react';
import type { ComponentProps } from './index';

const KToolbar: FC<ComponentProps> = ({ node, children, theme }) => {
  const position = (node.props?.position as string) || 'bottom';
  const outline = node.props?.outline !== false;
  const isBottom = position !== 'top';

  // Konsta iOS applies pb-safe-4 = safe-area-bottom + 16px on bottom toolbars.
  // Override the CSS variable locally so the total padding stays reasonable in
  // the device preview (no real transparent home-indicator region to absorb it).
  const style = isBottom && theme === 'ios'
    ? { '--k-safe-area-bottom': '4px' } as React.CSSProperties
    : undefined;

  return (
    <Toolbar
      top={position === 'top'}
      outline={outline}
      className="!relative"
      style={style}
    >
      {children}
    </Toolbar>
  );
};

KToolbar.displayName = 'KToolbar';

export default KToolbar;
