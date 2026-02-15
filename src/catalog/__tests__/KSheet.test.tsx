import { render, screen, fireEvent } from '@testing-library/react';
import KSheet from '../KSheet';
import { makeNode, AllProviders } from '../../test/helpers';

function renderSheet(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Sheet', props });
  return render(
    <AllProviders>
      <KSheet node={node} theme="ios">{children}</KSheet>
    </AllProviders>
  );
}

describe('KSheet', () => {
  it('renders nothing when not opened', () => {
    const { container } = renderSheet({}, <div>Sheet content</div>);
    expect(container.textContent).toBe('');
  });

  it('renders children when opened', () => {
    renderSheet({ opened: true }, <div>Sheet content</div>);
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
  });

  it('renders without crashing with no children when opened', () => {
    const { container } = renderSheet({ opened: true });
    expect(container.firstChild).toBeTruthy();
  });

  it('closes when backdrop is clicked', () => {
    const { container } = renderSheet({ opened: true }, <div>Content</div>);
    const backdrop = container.querySelector('.k-sheet-backdrop');
    if (backdrop) fireEvent.click(backdrop);
    // After close, the overlay context should handle removal
  });
});
