import { render, screen } from '@testing-library/react';
import KMenuList from '../KMenuList';
import { makeNode } from '../../test/helpers';

function renderMenuList(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'MenuList', props });
  return render(<KMenuList node={node} theme="ios">{children}</KMenuList>);
}

describe('KMenuList', () => {
  it('renders children', () => {
    renderMenuList({}, <li>Menu item</li>);
    expect(screen.getByText('Menu item')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderMenuList();
    expect(container.firstChild).toBeTruthy();
  });
});
