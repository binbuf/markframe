import { render, screen } from '@testing-library/react';
import KRange from '../KRange';
import { makeNode } from '../../test/helpers';

function renderRange(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Range', props });
  return render(<KRange node={node} theme="ios" />);
}

describe('KRange', () => {
  it('renders without crashing', () => {
    const { container } = renderRange();
    expect(container.firstChild).toBeTruthy();
  });

  it('renders label when provided', () => {
    renderRange({ label: 'Volume' });
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    const { container } = renderRange();
    const label = container.querySelector('.text-xs');
    expect(label).toBeNull();
  });

  it('applies fill class', () => {
    const { container } = renderRange({ fill: true });
    expect(container.firstChild).toHaveClass('flex-1');
  });
});
