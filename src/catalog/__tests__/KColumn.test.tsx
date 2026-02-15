import { render, screen } from '@testing-library/react';
import KColumn from '../KColumn';
import { makeNode } from '../../test/helpers';

function renderColumn(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Column', props });
  return render(<KColumn node={node} theme="ios">{children}</KColumn>);
}

describe('KColumn', () => {
  it('renders children in a flex column', () => {
    const { container } = renderColumn({}, <span>Item</span>);
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('flex', 'flex-col');
  });

  it('applies gap as inline style', () => {
    const { container } = renderColumn({ gap: 12 });
    expect(container.firstChild).toHaveStyle({ gap: '12px' });
  });

  it('applies align and justify classes', () => {
    const { container } = renderColumn({ align: 'center', justify: 'end' });
    expect(container.firstChild).toHaveClass('items-center', 'justify-end');
  });

  it('defaults to items-stretch and justify-start', () => {
    const { container } = renderColumn();
    expect(container.firstChild).toHaveClass('items-stretch', 'justify-start');
  });

  it('applies padding classes', () => {
    const { container } = renderColumn({ p: 4, px: 2, py: 3 });
    expect(container.firstChild).toHaveClass('p-4', 'px-2', 'py-3');
  });

  it('applies fill class', () => {
    const { container } = renderColumn({ fill: true });
    expect(container.firstChild).toHaveClass('flex-1');
  });

  it('applies margin top/bottom as inline styles', () => {
    const { container } = renderColumn({ mt: 2, mb: 6 });
    expect(container.firstChild).toHaveStyle({
      marginTop: '0.5rem',
      marginBottom: '1.5rem',
    });
  });

  it('applies custom className', () => {
    const { container } = renderColumn({ className: 'my-class' });
    expect(container.firstChild).toHaveClass('my-class');
  });
});
