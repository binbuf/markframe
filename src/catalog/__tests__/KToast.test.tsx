import { screen, act } from '@testing-library/react';
import KToast from '../KToast';
import { makeNode, renderWithProviders } from '../../test/helpers';

function renderToast(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Toast', props });
  return renderWithProviders(<KToast node={node} theme="ios" />);
}

describe('KToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders text content', () => {
    renderToast({ text: 'Item saved!' });
    expect(screen.getByText('Item saved!')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderToast();
    expect(container.firstChild).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = renderToast({ text: 'Toast', className: 'my-toast' });
    expect(container.querySelector('.my-toast')).toBeTruthy();
  });

  it('defaults position to center', () => {
    const { container } = renderToast({ text: 'Centered' });
    expect(container.firstChild).toBeTruthy();
  });

  it('shows toast initially then auto-dismisses after duration', () => {
    const { container } = renderToast({ text: 'Bye soon', duration: 2000 });
    const toast = container.querySelector('.k-toast')!;
    // Visible initially — should NOT have pointer-events-none
    expect(toast.className).not.toContain('pointer-events-none');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // After auto-dismiss, Konsta applies hidden classes (opacity-0, pointer-events-none)
    expect(toast.className).toContain('pointer-events-none');
  });

  it('auto-dismisses with default 3s duration', () => {
    const { container } = renderToast({ text: 'Default' });
    const toast = container.querySelector('.k-toast')!;

    // Not yet dismissed at 2999ms
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(toast.className).not.toContain('pointer-events-none');

    // Dismissed at 3000ms
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(toast.className).toContain('pointer-events-none');
  });

  it('stays hidden when opened=false', () => {
    const { container } = renderToast({ text: 'Hidden', opened: false });
    const toast = container.querySelector('.k-toast')!;
    // opened=false + not dynamically triggered = hidden
    expect(toast.className).toContain('pointer-events-none');
  });

  it('supports duration=0 to disable auto-dismiss', () => {
    const { container } = renderToast({ text: 'Persistent', duration: 0 });
    const toast = container.querySelector('.k-toast')!;
    expect(toast.className).not.toContain('pointer-events-none');

    act(() => {
      vi.advanceTimersByTime(10000);
    });
    // Still visible because duration=0 disables auto-dismiss
    expect(toast.className).not.toContain('pointer-events-none');
  });
});
