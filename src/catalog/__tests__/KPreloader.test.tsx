import { render } from '@testing-library/react';
import KPreloader from '../KPreloader';
import { makeNode } from '../../test/helpers';

function renderPreloader(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Preloader', props });
  return render(<KPreloader node={node} theme="ios" />);
}

describe('KPreloader', () => {
  it('renders without crashing', () => {
    const { container } = renderPreloader();
    expect(container.firstChild).toBeTruthy();
  });

  it('applies default size 32px', () => {
    const { container } = renderPreloader();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('32px');
    expect(wrapper.style.height).toBe('32px');
  });

  it('applies custom size', () => {
    const { container } = renderPreloader({ size: 48 });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('48px');
    expect(wrapper.style.height).toBe('48px');
  });

  it('applies custom className', () => {
    const { container } = renderPreloader({ className: 'my-loader' });
    expect(container.firstChild).toHaveClass('my-loader');
  });
});
