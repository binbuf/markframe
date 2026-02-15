import { render, screen } from '@testing-library/react';
import KCenter from '../KCenter';
import { makeNode } from '../../test/helpers';

function renderCenter(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Center', props });
  return render(<KCenter node={node} theme="ios">{children}</KCenter>);
}

describe('KCenter', () => {
  it('renders children centered', () => {
    const { container } = renderCenter({}, <span>Centered</span>);
    expect(screen.getByText('Centered')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });

  it('applies fill class when fill=true', () => {
    const { container } = renderCenter({ fill: true });
    expect(container.firstChild).toHaveClass('flex-1', 'h-full', 'min-h-0');
  });

  it('does not apply fill classes by default', () => {
    const { container } = renderCenter();
    expect(container.firstChild).not.toHaveClass('flex-1');
  });

  it('applies padding class', () => {
    const { container } = renderCenter({ p: 8 });
    expect(container.firstChild).toHaveClass('p-8');
  });

  it('applies custom className', () => {
    const { container } = renderCenter({ className: 'custom' });
    expect(container.firstChild).toHaveClass('custom');
  });

  it('renders without crashing with no children', () => {
    const { container } = renderCenter();
    expect(container.firstChild).toBeTruthy();
  });
});
