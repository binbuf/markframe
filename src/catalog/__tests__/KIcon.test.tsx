import { render } from '@testing-library/react';
import KIcon from '../KIcon';
import { makeNode } from '../../test/helpers';

function renderIcon(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Icon', props });
  return render(<KIcon node={node} theme="ios" />);
}

describe('KIcon', () => {
  it('renders an ion-icon element', () => {
    const { container } = renderIcon({ name: 'home' });
    const icon = container.querySelector('ion-icon');
    expect(icon).toBeTruthy();
  });

  it('defaults to outline variant', () => {
    const { container } = renderIcon({ name: 'home' });
    const icon = container.querySelector('ion-icon');
    expect(icon?.getAttribute('name')).toBe('home-outline');
  });

  it('uses base name for filled variant', () => {
    const { container } = renderIcon({ name: 'home', variant: 'filled' });
    const icon = container.querySelector('ion-icon');
    expect(icon?.getAttribute('name')).toBe('home');
  });

  it('uses sharp variant', () => {
    const { container } = renderIcon({ name: 'home', variant: 'sharp' });
    const icon = container.querySelector('ion-icon');
    expect(icon?.getAttribute('name')).toBe('home-sharp');
  });

  it('applies size medium (24px) by default', () => {
    const { container } = renderIcon({ name: 'home' });
    const icon = container.querySelector('ion-icon') as HTMLElement;
    expect(icon?.style.fontSize).toBe('24px');
  });

  it('applies small size (20px)', () => {
    const { container } = renderIcon({ name: 'home', size: 'small' });
    const icon = container.querySelector('ion-icon') as HTMLElement;
    expect(icon?.style.fontSize).toBe('20px');
  });

  it('applies large size (32px)', () => {
    const { container } = renderIcon({ name: 'home', size: 'large' });
    const icon = container.querySelector('ion-icon') as HTMLElement;
    expect(icon?.style.fontSize).toBe('32px');
  });

  it('applies numeric size', () => {
    const { container } = renderIcon({ name: 'home', size: 48 });
    const icon = container.querySelector('ion-icon') as HTMLElement;
    expect(icon?.style.fontSize).toBe('48px');
  });

  it('applies custom color', () => {
    const { container } = renderIcon({ name: 'home', color: 'red' });
    const icon = container.querySelector('ion-icon') as HTMLElement;
    expect(icon?.style.color).toBe('red');
  });

  it('wraps in ml-auto span when push=true', () => {
    const { container } = renderIcon({ name: 'home', push: true });
    expect(container.querySelector('.ml-auto')).toBeTruthy();
  });
});
