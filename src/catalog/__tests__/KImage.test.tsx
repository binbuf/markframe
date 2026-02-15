import { render } from '@testing-library/react';
import KImage from '../KImage';
import { makeNode } from '../../test/helpers';

function renderImage(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Image', props });
  return render(<KImage node={node} theme="ios" />);
}

describe('KImage', () => {
  it('renders an img element', () => {
    const { container } = renderImage({ src: 'https://example.com/photo.jpg' });
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/photo.jpg');
  });

  it('applies alt text', () => {
    const { container } = renderImage({ src: 'https://example.com/photo.jpg', alt: 'A photo' });
    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('A photo');
  });

  it('applies width and height', () => {
    const { container } = renderImage({ src: 'https://example.com/photo.jpg', width: 200, height: 100 });
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('200');
    expect(img?.getAttribute('height')).toBe('100');
  });

  it('applies w-full by default when no width prop', () => {
    const { container } = renderImage({ src: 'https://example.com/photo.jpg' });
    const img = container.querySelector('img');
    expect(img).toHaveClass('w-full');
  });

  it('does not apply w-full when width is provided', () => {
    const { container } = renderImage({ src: 'https://example.com/photo.jpg', width: 100 });
    const img = container.querySelector('img');
    expect(img).not.toHaveClass('w-full');
  });

  it('applies circle classes', () => {
    const { container } = renderImage({ src: 'https://example.com/photo.jpg', circle: true });
    const img = container.querySelector('img');
    expect(img).toHaveClass('rounded-full', 'aspect-square', 'object-cover');
  });

  it('applies rounded class', () => {
    const { container } = renderImage({ src: 'https://example.com/photo.jpg', rounded: true });
    const img = container.querySelector('img');
    expect(img).toHaveClass('rounded-lg');
  });

  it('does not render dangerous protocols in src', () => {
    const { container } = renderImage({ src: 'javascript:alert(1)' });
    const img = container.querySelector('img');
    const src = img?.getAttribute('src') ?? '';
    expect(src).not.toContain('javascript:');
  });

  it('allows https URLs', () => {
    const { container } = renderImage({ src: 'https://example.com/safe.jpg' });
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/safe.jpg');
  });

  it('allows relative paths', () => {
    const { container } = renderImage({ src: '/images/photo.jpg' });
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/images/photo.jpg');
  });

  it('applies margin styles', () => {
    const { container } = renderImage({ src: 'https://example.com/photo.jpg', mt: 4, mb: 8 });
    const img = container.querySelector('img') as HTMLElement;
    expect(img?.style.marginTop).toBe('1rem');
    expect(img?.style.marginBottom).toBe('2rem');
  });
});
