import { render, screen } from '@testing-library/react';
import { renderNode } from '../renderNode';
import { makeNode, AllProviders } from '../../test/helpers';

// renderNode requires overlay/navigation/tree/device contexts via child components
function renderInProviders(node: Parameters<typeof renderNode>[0], theme: 'ios' | 'material' = 'ios') {
  return render(
    <AllProviders>{renderNode(node, theme)}</AllProviders>
  );
}

describe('renderNode', () => {
  it('renders a known component type', () => {
    const node = makeNode({ type: 'Text', props: { text: 'Hello' } });
    renderInProviders(node);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders an error box for unknown component types', () => {
    const node = makeNode({ type: 'NonExistent', id: 'bad-1' });
    renderInProviders(node);
    expect(screen.getByText(/Unknown component: NonExistent/)).toBeInTheDocument();
    expect(screen.getByText(/ID: bad-1/)).toBeInTheDocument();
  });

  it('recursively renders children', () => {
    const node = makeNode({
      type: 'Surface',
      children: [
        makeNode({ id: 'child-1', type: 'Text', props: { text: 'Child One' } }),
        makeNode({ id: 'child-2', type: 'Text', props: { text: 'Child Two' } }),
      ],
    });
    renderInProviders(node);
    expect(screen.getByText('Child One')).toBeInTheDocument();
    expect(screen.getByText('Child Two')).toBeInTheDocument();
  });

  it('handles deeply nested children', () => {
    const node = makeNode({
      type: 'Surface',
      children: [
        makeNode({
          id: 'row-1',
          type: 'Row',
          children: [
            makeNode({ id: 'text-deep', type: 'Text', props: { text: 'Deep text' } }),
          ],
        }),
      ],
    });
    renderInProviders(node);
    expect(screen.getByText('Deep text')).toBeInTheDocument();
  });

  it('handles node with no children', () => {
    const node = makeNode({ type: 'Text', props: { text: 'Leaf' }, children: undefined });
    renderInProviders(node);
    expect(screen.getByText('Leaf')).toBeInTheDocument();
  });

  it('renders KNoop types as null', () => {
    const node = makeNode({ type: 'DialogButton', id: 'noop-1', props: { label: 'OK' } });
    const { container } = renderInProviders(node);
    // KNoop returns null, so no content is rendered for it
    expect(container.querySelector('[data-testid]')).toBeNull();
  });

  it('renders error box when renderNode catches a synchronous error', () => {
    // Trigger the catch block by providing children that cause .map to throw
    const badNode = makeNode({
      type: 'Text',
      id: 'bad-children',
      props: { text: 'Hi' },
      children: 'not-an-array' as any, // .map will throw
    });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderInProviders(badNode);

    expect(screen.getByText(/Error rendering: Text/)).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('renders "Unknown error" for non-Error throws in renderNode', () => {
    // Use Object.defineProperty to make children getter throw a non-Error
    const node = makeNode({ type: 'Text', id: 'throw-getter', props: { text: 'Hi' } });
    Object.defineProperty(node, 'children', {
      get() { throw 'string failure'; },
      configurable: true,
    });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderInProviders(node);

    expect(screen.getByText(/Error rendering: Text/)).toBeInTheDocument();
    expect(screen.getByText('Unknown error')).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
