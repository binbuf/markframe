import { render, screen } from '@testing-library/react';
import KMenuItem from '../KMenuItem';
import { makeNode } from '../../test/helpers';

function renderMenuItem(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'MenuItem', props });
  return render(<KMenuItem node={node} theme="ios" />);
}

describe('KMenuItem', () => {
  it('renders with title', () => {
    renderMenuItem({ title: 'Settings' });
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    renderMenuItem({ title: 'Item', subtitle: 'Description' });
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderMenuItem();
    expect(container.firstChild).toBeTruthy();
  });
});
