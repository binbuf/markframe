import { render, screen } from '@testing-library/react';
import KToolbar from '../KToolbar';
import { makeNode } from '../../test/helpers';

function renderToolbar(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Toolbar', props });
  return render(<KToolbar node={node} theme="ios">{children}</KToolbar>);
}

describe('KToolbar', () => {
  it('renders children', () => {
    renderToolbar({}, <span>Toolbar content</span>);
    expect(screen.getByText('Toolbar content')).toBeInTheDocument();
  });

  it('renders without crashing with no children', () => {
    const { container } = renderToolbar();
    expect(container.firstChild).toBeTruthy();
  });
});
