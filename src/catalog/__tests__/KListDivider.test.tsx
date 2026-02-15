import { render } from '@testing-library/react';
import KListDivider from '../KListDivider';
import { makeNode } from '../../test/helpers';

function renderListDivider(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'ListDivider', props });
  return render(<KListDivider node={node} theme="ios" />);
}

describe('KListDivider', () => {
  it('renders with default 1px height', () => {
    const { container } = renderListDivider();
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe('1px');
  });

  it('applies custom height', () => {
    const { container } = renderListDivider({ height: 2 });
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe('2px');
  });

  it('applies custom margin', () => {
    const { container } = renderListDivider({ margin: 8 });
    const div = container.firstChild as HTMLElement;
    expect(div.style.marginTop).toBe('8px');
    expect(div.style.marginBottom).toBe('8px');
  });

  it('renders without crashing with no props', () => {
    const { container } = renderListDivider();
    expect(container.firstChild).toBeTruthy();
  });
});
