import { render, screen } from '@testing-library/react';
import KNavbar from '../KNavbar';
import KSegmented from '../KSegmented';
import { makeNode, AllProviders } from '../../test/helpers';

function renderNavbar(
  props: Record<string, unknown> = {},
  children?: React.ReactNode,
  nodeChildren?: { type: string; props?: Record<string, unknown> }[],
) {
  const node = makeNode({
    type: 'Navbar',
    props,
    children: nodeChildren?.map((c, i) => makeNode({ id: `child-${i}`, type: c.type, props: c.props })),
  });
  return render(
    <AllProviders>
      <KNavbar node={node} theme="ios">{children}</KNavbar>
    </AllProviders>
  );
}

describe('KNavbar', () => {
  it('renders with default title "App"', () => {
    renderNavbar();
    expect(screen.getByText('App')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    renderNavbar({ title: 'My Page' });
    expect(screen.getByText('My Page')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    renderNavbar({ title: 'Title', subtitle: 'Subtitle text' });
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
  });

  it('renders back button when backButton=true', () => {
    const { container } = renderNavbar({ backButton: true, backText: 'Back' });
    const backLink = container.querySelector('.k-navbar-back-link');
    expect(backLink).toBeTruthy();
  });

  it('renders right text when provided', () => {
    renderNavbar({ rightText: 'Edit' });
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders children in right slot', () => {
    renderNavbar({}, <span>Right Child</span>);
    expect(screen.getByText('Right Child')).toBeInTheDocument();
  });

  it('renders without crashing with minimal props', () => {
    const { container } = renderNavbar();
    expect(container.firstChild).toBeTruthy();
  });

  it('renders back button with navigateTo', () => {
    const navigate = vi.fn();
    const node = makeNode({ type: 'Navbar', props: { backButton: true, navigateTo: 'home' } });
    const { container } = render(
      <AllProviders navigate={navigate}>
        <KNavbar node={node} theme="ios" />
      </AllProviders>
    );
    const backLink = container.querySelector('.k-navbar-back-link');
    expect(backLink).toBeTruthy();
  });

  it('routes Segmented children to subnavbar slot', () => {
    const segNode = makeNode({
      id: 'seg-1',
      type: 'Segmented',
      props: { options: ['All', 'Missed'] },
    });
    const node = makeNode({
      type: 'Navbar',
      props: { title: 'Calls' },
      children: [segNode],
    });

    const segmentedEl = <KSegmented key="seg-1" node={segNode} theme="ios" />;
    const { container } = render(
      <AllProviders>
        <KNavbar node={node} theme="ios">{segmentedEl}</KNavbar>
      </AllProviders>
    );

    // Segmented options should render
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Missed')).toBeInTheDocument();

    // Should NOT be in the right slot (flex gap-2 div)
    const rightSlot = container.querySelector('.flex.gap-2');
    expect(rightSlot).toBeFalsy();
  });

  it('keeps non-Segmented children in right slot', () => {
    const linkNode = makeNode({ id: 'link-1', type: 'Link', props: {} });
    const node = makeNode({
      type: 'Navbar',
      props: { title: 'Page' },
      children: [linkNode],
    });

    const linkEl = <span key="link-1">Edit</span>;
    const { container } = render(
      <AllProviders>
        <KNavbar node={node} theme="ios">{linkEl}</KNavbar>
      </AllProviders>
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    // Should be in the right slot
    const rightSlot = container.querySelector('.flex.gap-2');
    expect(rightSlot).toBeTruthy();
  });
});
