import { type FC } from 'react';
import type { ComponentProps } from './index';

const KTabs: FC<ComponentProps> = ({ node, children }) => {
  // Read tabs from child Tab nodes (markframe pattern) or from tabs prop
  const tabChildren = (node.children || []).filter(c => c.type === 'Tab');
  const tabs = tabChildren.length > 0
    ? tabChildren.map(c => (c.props?.label as string) || '')
    : (node.props?.tabs as string[]) || ['Tab 1', 'Tab 2', 'Tab 3'];
  const activeIndex = (node.props?.active as number) ?? (node.props?.activeIndex as number) ?? 0;
  const position = (node.props?.position as string) || 'top';

  return (
    <div className="w-full flex flex-col">
      {/* Tab Bar */}
      <div
        className={`flex border-black/10 dark:border-white/10 ${
          position === 'bottom' ? 'order-2 border-t' : 'order-1 border-b'
        }`}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors ${
              index === activeIndex
                ? 'text-primary border-b-2 border-primary'
                : 'text-black/60 dark:text-white/60 hover:text-black/70 dark:hover:text-white/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {children && (
        <div className={position === 'bottom' ? 'order-1' : 'order-2'}>
          {children}
        </div>
      )}
    </div>
  );
};

KTabs.displayName = 'KTabs';

export default KTabs;

