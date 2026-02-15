import { render, screen } from '@testing-library/react';
import KBreadcrumbs from '../KBreadcrumbs';
import { makeNode } from '../../test/helpers';

function renderBreadcrumbs(props: Record<string, unknown> = {}, nodeOverrides: Partial<ReturnType<typeof makeNode>> = {}) {
  const node = makeNode({ type: 'Breadcrumbs', props, ...nodeOverrides });
  return render(<KBreadcrumbs node={node} theme="ios" />);
}

describe('KBreadcrumbs', () => {
  it('renders breadcrumb items', () => {
    renderBreadcrumbs({}, {
      children: [
        makeNode({ id: 'crumb-1', type: 'BreadcrumbsItem', props: { label: 'Home' } }),
        makeNode({ id: 'crumb-2', type: 'BreadcrumbsItem', props: { label: 'Products' } }),
        makeNode({ id: 'crumb-3', type: 'BreadcrumbsItem', props: { label: 'Item', active: true } }),
      ],
    });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('renders without crashing with no children', () => {
    const { container } = renderBreadcrumbs();
    expect(container.firstChild).toBeTruthy();
  });
});
