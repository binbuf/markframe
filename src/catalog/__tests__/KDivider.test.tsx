import { render } from '@testing-library/react';
import KDivider from '../KDivider';
import { makeNode } from '../../test/helpers';

function renderDivider(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Divider', props });
  return render(<KDivider node={node} theme="ios" />);
}

describe('KDivider', () => {
  it('renders horizontal divider by default', () => {
    const { container } = renderDivider();
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe('1px');
    expect(div.style.width).toBe('100%');
  });

  it('renders vertical divider', () => {
    const { container } = renderDivider({ orientation: 'vertical' });
    const div = container.firstChild as HTMLElement;
    expect(div.style.width).toBe('1px');
    expect(div.style.height).toBe('100%');
  });

  it('applies custom thickness', () => {
    const { container } = renderDivider({ thickness: 2 });
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe('2px');
  });

  it('applies custom spacing', () => {
    const { container } = renderDivider({ spacing: 24 });
    const div = container.firstChild as HTMLElement;
    expect(div.style.marginTop).toBe('24px');
    expect(div.style.marginBottom).toBe('24px');
  });

  it('applies inset class', () => {
    const { container } = renderDivider({ inset: true });
    expect(container.firstChild).toHaveClass('ml-4');
  });

  it('renders without crashing with no props', () => {
    const { container } = renderDivider();
    expect(container.firstChild).toBeTruthy();
  });
});
