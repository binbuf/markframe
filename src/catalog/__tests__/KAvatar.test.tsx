import { render } from '@testing-library/react';
import KAvatar from '../KAvatar';
import { makeNode } from '../../test/helpers';

function renderAvatar(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Avatar', props });
  return render(<KAvatar node={node} theme="ios" />);
}

describe('KAvatar', () => {
  it('renders an image when src is a URL', () => {
    const { container } = renderAvatar({ src: 'https://example.com/avatar.jpg' });
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/avatar.jpg');
  });

  it('renders placeholder icon when placeholder prop set', () => {
    const { container } = renderAvatar({ placeholder: 'person' });
    const icon = container.querySelector('ion-icon');
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('name')).toBe('person');
  });

  it('applies size as inline style', () => {
    const { container } = renderAvatar({ size: 64 });
    const img = container.querySelector('img') as HTMLElement;
    expect(img?.style.width).toBe('64px');
    expect(img?.style.height).toBe('64px');
  });

  it('defaults to size 40', () => {
    const { container } = renderAvatar();
    const img = container.querySelector('img') as HTMLElement;
    expect(img?.style.width).toBe('40px');
  });

  it('renders badge', () => {
    const { container } = renderAvatar({ badge: '3' });
    const badge = container.querySelector('.bg-red-500');
    expect(badge).toBeTruthy();
    expect(badge?.textContent).toBe('3');
  });

  it('applies border classes', () => {
    const { container } = renderAvatar({ border: 'blue' });
    const img = container.querySelector('.border-2');
    expect(img).toBeTruthy();
  });

  it('auto-assigns avatar from pool when no src', () => {
    const { container } = renderAvatar();
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    // Should have a path from the avatar pool
    expect(img?.getAttribute('src')).toMatch(/\/assets\/avatars\//);
  });
});
