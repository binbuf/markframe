import { render, screen } from '@testing-library/react';
import KSegmented from '../KSegmented';
import { makeNode } from '../../test/helpers';

function renderSegmented(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Segmented', props });
  return render(<KSegmented node={node} theme="ios" />);
}

describe('KSegmented', () => {
  it('renders default options', () => {
    renderSegmented();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders custom options', () => {
    renderSegmented({ options: ['A', 'B'] });
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderSegmented();
    expect(container.firstChild).toBeTruthy();
  });

  it('applies fill class', () => {
    const { container } = renderSegmented({ fill: true });
    expect(container.firstChild).toHaveClass('flex-1');
  });

  it('applies custom className', () => {
    const { container } = renderSegmented({ className: 'my-seg' });
    expect(container.firstChild).toHaveClass('my-seg');
  });

  it('applies width style when provided', () => {
    const { container } = renderSegmented({ width: 200 });
    expect(container.firstChild).toHaveStyle({ width: '200px' });
  });

  it('applies default mx-4 margin', () => {
    const { container } = renderSegmented();
    expect(container.firstChild).toHaveClass('mx-4');
  });

  it('skips default mx-4 when className has mx- override', () => {
    const { container } = renderSegmented({ className: 'mx-auto' });
    expect(container.firstChild).not.toHaveClass('mx-4');
    expect(container.firstChild).toHaveClass('mx-auto');
  });

  it('skips default my-4 when className has my- override', () => {
    const { container } = renderSegmented({ className: 'my-2' });
    expect(container.firstChild).not.toHaveClass('my-4');
    expect(container.firstChild).toHaveClass('my-2');
  });
});
