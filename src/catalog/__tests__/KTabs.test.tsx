import { render, screen } from '@testing-library/react';
import KTabs from '../KTabs';
import { makeNode } from '../../test/helpers';

function renderTabs(props: Record<string, unknown> = {}, nodeOverrides: Partial<ReturnType<typeof makeNode>> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Tabs', props, ...nodeOverrides });
  return render(<KTabs node={node} theme="ios">{children}</KTabs>);
}

describe('KTabs', () => {
  it('renders default tabs when no props', () => {
    renderTabs();
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders custom tabs from tabs prop', () => {
    renderTabs({ tabs: ['Home', 'Profile', 'Settings'] });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders tabs from child Tab nodes', () => {
    renderTabs({}, {
      children: [
        makeNode({ id: 'tab-1', type: 'Tab', props: { label: 'First' } }),
        makeNode({ id: 'tab-2', type: 'Tab', props: { label: 'Second' } }),
      ],
    });
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('highlights active tab with primary color', () => {
    renderTabs({ tabs: ['A', 'B'], active: 1 });
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveClass('text-primary');
  });

  it('defaults to first tab active', () => {
    renderTabs({ tabs: ['A', 'B'] });
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('text-primary');
  });

  it('renders children content', () => {
    renderTabs({}, {}, <div>Tab content</div>);
    expect(screen.getByText('Tab content')).toBeInTheDocument();
  });

  it('places content below tabs by default', () => {
    const { container } = renderTabs({}, {}, <div>Content</div>);
    const tabBar = container.querySelector('.order-1');
    const content = container.querySelector('.order-2');
    expect(tabBar).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('places content above tabs when position=bottom', () => {
    const { container } = renderTabs({ position: 'bottom' }, {}, <div>Content</div>);
    // tab bar is order-2, content is order-1
    const tabBar = container.querySelector('.order-2.border-t');
    expect(tabBar).toBeTruthy();
  });
});
