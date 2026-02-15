import { render, screen } from '@testing-library/react';
import KIconCircle from '../KIconCircle';
import { makeNode } from '../../test/helpers';

function renderIconCircle(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'IconCircle', props });
  return render(<KIconCircle node={node} theme="ios" />);
}

describe('KIconCircle', () => {
  it('renders icon', () => {
    const { container } = renderIconCircle({ icon: 'settings' });
    const icon = container.querySelector('ion-icon');
    expect(icon?.getAttribute('name')).toBe('settings');
  });

  it('renders label', () => {
    renderIconCircle({ icon: 'home', label: 'Home' });
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies default size 64px', () => {
    const { container } = renderIconCircle();
    const circle = container.querySelector('[style]') as HTMLElement;
    expect(circle.style.width).toBe('64px');
    expect(circle.style.height).toBe('64px');
  });

  it('applies custom size', () => {
    const { container } = renderIconCircle({ size: 48 });
    const circle = container.querySelector('[style]') as HTMLElement;
    expect(circle.style.width).toBe('48px');
    expect(circle.style.height).toBe('48px');
  });

  it('applies custom background color from bg prop', () => {
    const { container } = renderIconCircle({ icon: 'basket', color: 'green', bg: 'green-100' });
    const circle = container.querySelector('.rounded-full') as HTMLElement;
    expect(circle).toBeTruthy();
    expect(circle?.style.backgroundColor).toBe('rgb(220, 252, 231)'); // #dcfce7 as rgb
  });

  it('applies default background color based on color prop', () => {
    const { container } = renderIconCircle({ icon: 'basket', color: 'blue' });
    const circle = container.querySelector('.rounded-full') as HTMLElement;
    expect(circle).toBeTruthy();
    // Should default to blue-100
    expect(circle?.style.backgroundColor).toBe('rgb(219, 234, 254)'); // #dbeafe as rgb
  });

  it('renders without crashing with no props', () => {
    const { container } = renderIconCircle();
    expect(container.firstChild).toBeTruthy();
  });
});
