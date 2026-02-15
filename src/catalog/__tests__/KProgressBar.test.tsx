import { render } from '@testing-library/react';
import KProgressBar from '../KProgressBar';
import { makeNode } from '../../test/helpers';

function renderProgressBar(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'ProgressBar', props });
  return render(<KProgressBar node={node} theme="ios" />);
}

describe('KProgressBar', () => {
  it('renders without crashing', () => {
    const { container } = renderProgressBar();
    expect(container.firstChild).toBeTruthy();
  });

  it('calculates percentage width correctly', () => {
    const { container } = renderProgressBar({ value: 50, max: 100 });
    // The inner bar should have width: 50%
    const innerBar = container.firstChild?.lastChild as HTMLElement;
    expect(innerBar.style.width).toBe('50%');
  });

  it('clamps to 100%', () => {
    const { container } = renderProgressBar({ value: 200, max: 100 });
    const innerBar = container.firstChild?.lastChild as HTMLElement;
    expect(innerBar.style.width).toBe('100%');
  });

  it('clamps to 0%', () => {
    const { container } = renderProgressBar({ value: -10, max: 100 });
    const innerBar = container.firstChild?.lastChild as HTMLElement;
    expect(innerBar.style.width).toBe('0%');
  });

  it('applies custom height', () => {
    const { container } = renderProgressBar({ height: 8 });
    expect((container.firstChild as HTMLElement).style.height).toBe('8px');
  });

  it('applies color', () => {
    const { container } = renderProgressBar({ value: 50, color: 'green' });
    const innerBar = container.firstChild?.lastChild as HTMLElement;
    // Now uses inline backgroundColor instead of class
    expect(innerBar.style.backgroundColor).toBe('rgb(34, 197, 94)'); // #22c55e as rgb
  });

  it('applies rounded class by default', () => {
    const { container } = renderProgressBar();
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('removes rounded when rounded=false', () => {
    const { container } = renderProgressBar({ rounded: false });
    expect(container.firstChild).not.toHaveClass('rounded-full');
  });
});
