import { render, screen } from '@testing-library/react';
import KToggle from '../KToggle';
import { makeNode } from '../../test/helpers';

function renderToggle(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Toggle', props });
  return render(<KToggle node={node} theme="ios" />);
}

describe('KToggle', () => {
  it('renders with default label', () => {
    renderToggle();
    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    renderToggle({ label: 'Dark Mode' });
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderToggle({ label: 'Feature', description: 'Enable this' });
    expect(screen.getByText('Enable this')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderToggle();
    expect(container.firstChild).toBeTruthy();
  });
});
