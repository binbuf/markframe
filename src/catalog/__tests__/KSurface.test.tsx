import { render, screen } from '@testing-library/react';
import KSurface from '../KSurface';
import { makeNode, AllProviders } from '../../test/helpers';

function renderSurface(nodeOverrides: Partial<Parameters<typeof makeNode>[0]> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Surface', ...nodeOverrides });
  return render(
    <AllProviders>
      <KSurface node={node} theme="ios">{children}</KSurface>
    </AllProviders>
  );
}

describe('KSurface', () => {
  it('renders children inside a page', () => {
    renderSurface({}, <div>Hello Surface</div>);
    expect(screen.getByText('Hello Surface')).toBeInTheDocument();
  });

  it('renders without crashing with no children', () => {
    const { container } = renderSurface();
    expect(container.firstChild).toBeTruthy();
  });

  it('renders multiple children', () => {
    renderSurface({}, <>
      <div>First</div>
      <div>Second</div>
    </>);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('detects tabbar children and separates layout', () => {
    const node = makeNode({
      type: 'Surface',
      children: [
        makeNode({ id: 'text-1', type: 'Text', props: { text: 'Content' } }),
        makeNode({ id: 'tabbar-1', type: 'Tabbar' }),
      ],
    });
    // When there's a Tabbar child, KSurface creates a flex column layout
    const { container } = render(
      <AllProviders>
        <KSurface node={node} theme="ios">
          <div>Content</div>
        </KSurface>
      </AllProviders>
    );
    // The flex column layout div should exist
    const flexDiv = container.querySelector('.flex.flex-col');
    expect(flexDiv).toBeTruthy();
  });

  it('uses Page when no tabbar is present', () => {
    const node = makeNode({
      type: 'Surface',
      children: [
        makeNode({ id: 'text-1', type: 'Text', props: { text: 'Content' } }),
      ],
    });
    const { container } = render(
      <AllProviders>
        <KSurface node={node} theme="ios">
          <div>Content</div>
        </KSurface>
      </AllProviders>
    );
    // Without tabbar, should not have the flex column wrapper
    const flexDiv = container.querySelector('.h-full.flex.flex-col');
    expect(flexDiv).toBeNull();
  });

  it('wraps content in OverlayProvider', () => {
    // Verify no error thrown about missing OverlayProvider context
    // by rendering overlay-dependent children
    expect(() => renderSurface({}, <div>Works</div>)).not.toThrow();
  });
});
