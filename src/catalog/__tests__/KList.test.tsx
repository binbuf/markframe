import { render, screen } from '@testing-library/react';
import KList from '../KList';
import { makeNode } from '../../test/helpers';

function renderList(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'List', props });
  return render(<KList node={node} theme="ios">{children}</KList>);
}

describe('KList', () => {
  it('renders children', () => {
    renderList({}, <li>Item</li>);
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderList();
    expect(container.firstChild).toBeTruthy();
  });

  it('renders as a list element', () => {
    const { container } = renderList();
    expect(container.querySelector('ul')).toBeTruthy();
  });
});
