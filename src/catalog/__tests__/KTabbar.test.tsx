import { render, screen } from '@testing-library/react';
import KTabbar from '../KTabbar';
import { makeNode, AllProviders } from '../../test/helpers';

function renderTabbar(props: Record<string, unknown> = {}, nodeOverrides: Partial<ReturnType<typeof makeNode>> = {}) {
  const node = makeNode({ type: 'Tabbar', props, ...nodeOverrides });
  return render(
    <AllProviders>
      <KTabbar node={node} theme="ios" />
    </AllProviders>
  );
}

describe('KTabbar', () => {
  it('renders nothing when no children or tabs prop', () => {
    const { container } = renderTabbar();
    // Should render nothing when there are no tabs defined
    expect(container.firstChild).toBeNull();
  });

  it('renders tabs from child Tab nodes', () => {
    renderTabbar({}, {
      children: [
        makeNode({ id: 'tab-1', type: 'Tab', props: { label: 'Feed', icon: 'home' } }),
        makeNode({ id: 'tab-2', type: 'Tab', props: { label: 'Explore', icon: 'search' } }),
      ],
    });
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });

  it('renders nothing with empty children array', () => {
    const { container } = renderTabbar({}, { children: [] });
    expect(container.firstChild).toBeNull();
  });

  it('shows "More" tab when more than 5 tabs', () => {
    const tabs = Array.from({ length: 6 }, (_, i) =>
      makeNode({ id: `tab-${i}`, type: 'Tab', props: { label: `Tab ${i + 1}`, icon: 'home' } })
    );
    renderTabbar({}, { children: tabs });
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('does not show "More" tab with 5 or fewer tabs', () => {
    const tabs = Array.from({ length: 5 }, (_, i) =>
      makeNode({ id: `tab-${i}`, type: 'Tab', props: { label: `Tab ${i + 1}` } })
    );
    renderTabbar({}, { children: tabs });
    expect(screen.queryByText('More')).not.toBeInTheDocument();
  });

  it('renders badges on tabs', () => {
    renderTabbar({}, {
      children: [
        makeNode({ id: 'tab-1', type: 'Tab', props: { label: 'Home', icon: 'home', badge: '3' } }),
      ],
    });
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
