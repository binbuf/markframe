import { render, screen } from '@testing-library/react';
import KBadge from '../KBadge';
import { makeNode } from '../../test/helpers';

function renderBadge(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Badge', props });
  return render(<KBadge node={node} theme="ios">{children}</KBadge>);
}

describe('KBadge', () => {
  it('renders text prop', () => {
    renderBadge({ text: '3' });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders children when no text', () => {
    renderBadge({}, <span>99+</span>);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('renders dot badge (no text content)', () => {
    const { container } = renderBadge({ dot: true });
    // Dot badge renders with no text content
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent).toBe('');
  });

  it('renders without crashing with no props', () => {
    const { container } = renderBadge();
    expect(container.firstChild).toBeTruthy();
  });
});
