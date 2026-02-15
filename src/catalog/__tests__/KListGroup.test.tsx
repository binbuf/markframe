import { render, screen } from '@testing-library/react';
import KListGroup from '../KListGroup';
import { makeNode } from '../../test/helpers';

function renderListGroup(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'ListGroup', props });
  return render(<KListGroup node={node} theme="ios">{children}</KListGroup>);
}

describe('KListGroup', () => {
  it('renders title', () => {
    renderListGroup({ title: 'Section A' });
    expect(screen.getByText('Section A')).toBeInTheDocument();
  });

  it('renders children', () => {
    renderListGroup({}, <li>Item</li>);
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderListGroup();
    expect(container.firstChild).toBeTruthy();
  });
});
