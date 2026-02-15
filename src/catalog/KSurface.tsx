import { type FC, Children, isValidElement } from 'react';
import { Page } from 'konsta/react';
import type { ComponentProps } from './index';

import { OverlayProvider } from './OverlayContext';

const KSurface: FC<ComponentProps> = ({ node, children }) => {
  const hasTabbar = (node.children || []).some(c => c.type === 'Tabbar');

  if (!hasTabbar) {
    return (
      <OverlayProvider>
        <Page
          className="overflow-x-hidden"
          style={{ '--k-tabbar-height': '0px' } as React.CSSProperties}
        >
          {children}
        </Page>
      </OverlayProvider>
    );
  }

  // Separate tabbar from content so tabbar stays fixed at the bottom.
  // We can't use Konsta's <Page> here because it uses absolute positioning
  // which breaks flex layout. A plain scrollable div works correctly.
  const childArray = Children.toArray(children);
  const tabbarChild = childArray.find(
    child => isValidElement(child) && (child.type as any)?.displayName === 'KTabbar'
  );
  const contentChildren = childArray.filter(child => child !== tabbarChild);

  return (
    <OverlayProvider>
      <div
        className="h-full flex flex-col bg-white dark:bg-black"
        style={{ '--k-tabbar-height': '80px' } as React.CSSProperties}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          {contentChildren}
        </div>
        <div className="flex-shrink-0">
          {tabbarChild}
        </div>
      </div>
    </OverlayProvider>
  );
};

export default KSurface;
