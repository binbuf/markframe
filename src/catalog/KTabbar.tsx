import { type FC, useState } from 'react';
import { Tabbar, TabbarLink, Badge, Actions, ActionsGroup, ActionsButton, ActionsLabel } from 'konsta/react';
import type { ComponentProps } from './index';
import { useNavigation } from './NavigationContext';
import { useDevice } from './DeviceContext';

const MAX_VISIBLE = 5;

const KTabbar: FC<ComponentProps> = ({ node, theme }) => {
  const navigate = useNavigation();
  const { device } = useDevice();
  const [moreOpen, setMoreOpen] = useState(false);
  const activeIndex = (node.props?.active as number) ?? (node.props?.activeIndex as number) ?? 0;
  const labels = node.props?.showLabels !== false;

  // Build tabs from child Tab nodes (markframe pattern) or from tabs prop (legacy)
  const tabChildren = (node.children || []).filter(c => c.type === 'Tab');
  const tabs = tabChildren.length > 0
    ? tabChildren.map(c => ({
        label: (c.props?.label as string) || '',
        icon: c.props?.icon as string | undefined,
        badge: c.props?.badge as string | number | undefined,
        navigateTo: c.props?.navigateTo as string | undefined,
      }))
    : (node.props?.tabs as { label: string; icon?: string; badge?: string | number; navigateTo?: string }[]) || [];

  // If there are no tabs defined, render nothing
  if (tabs.length === 0) return null;

  const hasIcons = tabs.some(tab => !!tab.icon);

  const hasOverflow = tabs.length > MAX_VISIBLE;
  const visibleTabs = hasOverflow ? tabs.slice(0, MAX_VISIBLE - 1) : tabs;
  const overflowTabs = hasOverflow ? tabs.slice(MAX_VISIBLE - 1) : [];

  // Konsta's toolbar inner uses `w-full md:w-auto`. On desktop browsers the
  // md breakpoint is always active, so the inner sizes to content. Without a
  // min-width on each link, flex-1/w-0 items collapse to 0px.
  let minWidthClass = '!min-w-[3rem]'; // 48px baseline for tablets
  if (device.formFactor === 'phone') {
    if (device.dimensions.width >= 430) {
      minWidthClass = '!min-w-[4.5rem]'; // 72px for larger phones
    } else {
      minWidthClass = '!min-w-[4rem]';   // 64px for standard phones
    }
  }

  const linkClassName = `!flex-1 !w-0 ${minWidthClass} overflow-hidden ${theme === 'ios' ? 'px-0' : 'px-0.5'}`;

  const renderTabLink = (tab: typeof tabs[number], index: number) => (
    <TabbarLink
      key={index}
      active={index === activeIndex}
      label={tab.label}
      onClick={tab.navigateTo && navigate ? () => navigate(tab.navigateTo!) : undefined}
      className={linkClassName}
      icon={
        tab.icon ? (
          <span className="relative">
            <ion-icon name={tab.icon} style={{ fontSize: '24px' }} />
            {tab.badge !== undefined && (
              <Badge
                small
                colors={{ bg: 'bg-red-600 dark:bg-red-500', text: 'text-white' }}
                className="absolute -top-1 -right-3"
              >
                {tab.badge}
              </Badge>
            )}
          </span>
        ) : undefined
      }
    />
  );

  return (
    <>
      <Tabbar
        labels={labels}
        icons={hasIcons}
        className="!relative"
        style={theme === 'ios'
          ? { '--k-safe-area-bottom': '4px' } as React.CSSProperties
          : undefined}
      >
        {visibleTabs.map((tab, index) => renderTabLink(tab, index))}
        {hasOverflow && (
          <TabbarLink
            active={activeIndex >= MAX_VISIBLE - 1}
            label="More"
            onClick={() => setMoreOpen(true)}
            className={linkClassName}
            icon={
              <span className="relative">
                <ion-icon name="ellipsis-horizontal" style={{ fontSize: '24px' }} />
              </span>
            }
          />
        )}
      </Tabbar>
      {hasOverflow && (
        <Actions
          opened={moreOpen}
          onBackdropClick={() => setMoreOpen(false)}
        >
          <ActionsGroup>
            <ActionsLabel>More Tabs</ActionsLabel>
            {overflowTabs.map((tab, i) => {
              const realIndex = MAX_VISIBLE - 1 + i;
              return (
                <ActionsButton
                  key={realIndex}
                  bold={realIndex === activeIndex}
                  onClick={() => {
                    setMoreOpen(false);
                    if (tab.navigateTo && navigate) navigate(tab.navigateTo);
                  }}
                >
                  <span className="flex items-center gap-2">
                    {tab.icon && <ion-icon name={tab.icon} style={{ fontSize: '20px' }} />}
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <Badge
                        small
                        colors={{ bg: 'bg-red-600 dark:bg-red-500', text: 'text-white' }}
                      >
                        {tab.badge}
                      </Badge>
                    )}
                  </span>
                </ActionsButton>
              );
            })}
          </ActionsGroup>
          <ActionsGroup>
            <ActionsButton onClick={() => setMoreOpen(false)}>
              Cancel
            </ActionsButton>
          </ActionsGroup>
        </Actions>
      )}
    </>
  );
};

KTabbar.displayName = 'KTabbar';

export default KTabbar;

