import { render, screen } from '@testing-library/react';
import KGrid from '../KGrid';
import { makeNode } from '../../test/helpers';

function renderGrid(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Grid', props });
  return render(<KGrid node={node} theme="ios">{children}</KGrid>);
}

describe('KGrid', () => {
  it('renders children in a CSS grid', () => {
    const { container } = renderGrid({}, <div>Cell</div>);
    expect(screen.getByText('Cell')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('grid');
  });

  it('defaults to 2 columns', () => {
    const { container } = renderGrid();
    expect(container.firstChild).toHaveStyle({
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    });
  });

  it('accepts custom cols', () => {
    const { container } = renderGrid({ cols: 3 });
    expect(container.firstChild).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    });
  });

  it('defaults to 4px gap', () => {
    const { container } = renderGrid();
    expect(container.firstChild).toHaveStyle({ gap: '4px' });
  });

  it('accepts custom gap', () => {
    const { container } = renderGrid({ gap: 16 });
    expect(container.firstChild).toHaveStyle({ gap: '16px' });
  });

  it('applies padding class', () => {
    const { container } = renderGrid({ p: 4 });
    expect(container.firstChild).toHaveClass('p-4');
  });

  it('applies custom className', () => {
    const { container } = renderGrid({ className: 'my-grid' });
    expect(container.firstChild).toHaveClass('my-grid');
  });
});
