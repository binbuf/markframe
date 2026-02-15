import { render, screen } from '@testing-library/react';
import KRow from '../KRow';
import { makeNode } from '../../test/helpers';

function renderRow(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Row', props });
  return render(<KRow node={node} theme="ios">{children}</KRow>);
}

describe('KRow', () => {
  it('renders children in a flex row', () => {
    const { container } = renderRow({}, <span>Item</span>);
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('flex', 'flex-row');
  });

  it('applies gap as inline style', () => {
    const { container } = renderRow({ gap: 8 });
    expect(container.firstChild).toHaveStyle({ gap: '8px' });
  });

  it('applies align center class', () => {
    const { container } = renderRow({ align: 'center' });
    expect(container.firstChild).toHaveClass('items-center');
  });

  it('applies justify between class', () => {
    const { container } = renderRow({ justify: 'between' });
    expect(container.firstChild).toHaveClass('justify-between');
  });

  it('defaults to items-stretch and justify-start', () => {
    const { container } = renderRow();
    expect(container.firstChild).toHaveClass('items-stretch', 'justify-start');
  });

  it('applies wrap class when wrap=true', () => {
    const { container } = renderRow({ wrap: true });
    expect(container.firstChild).toHaveClass('flex-wrap');
  });

  it('applies scroll classes when scroll=true', () => {
    const { container } = renderRow({ scroll: true });
    expect(container.firstChild).toHaveClass('flex-nowrap', 'overflow-x-auto');
  });

  it('applies padding classes', () => {
    const { container } = renderRow({ p: 4, px: 2 });
    expect(container.firstChild).toHaveClass('p-4', 'px-2');
  });

  it('applies fill class when fill=true', () => {
    const { container } = renderRow({ fill: true });
    expect(container.firstChild).toHaveClass('flex-1');
  });

  it('applies margin top/bottom as inline styles', () => {
    const { container } = renderRow({ mt: 4, mb: 8 });
    expect(container.firstChild).toHaveStyle({
      marginTop: '1rem',
      marginBottom: '2rem',
    });
  });

  it('applies border classes', () => {
    const { container } = renderRow({ borderTop: true, borderBottom: true });
    expect(container.firstChild).toHaveClass('border-t', 'border-b');
  });

  it('applies custom className', () => {
    const { container } = renderRow({ className: 'custom-class' });
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('falls back to defaults for unknown align/justify', () => {
    const { container } = renderRow({ align: 'unknown', justify: 'unknown' });
    expect(container.firstChild).toHaveClass('items-stretch', 'justify-start');
  });
});
