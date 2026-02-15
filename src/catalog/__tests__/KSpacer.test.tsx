import { render } from '@testing-library/react';
import KSpacer from '../KSpacer';
import { makeNode } from '../../test/helpers';

function renderSpacer(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Spacer', props });
  return render(<KSpacer node={node} theme="ios" />);
}

describe('KSpacer', () => {
  it('renders with default 16px height', () => {
    const { container } = renderSpacer();
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe('16px');
  });

  it('renders with custom size', () => {
    const { container } = renderSpacer({ size: 32 });
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe('32px');
  });

  it('renders as flex-grow when grow=true', () => {
    const { container } = renderSpacer({ grow: true });
    expect(container.firstChild).toHaveClass('flex-grow');
  });

  it('does not set height when grow=true', () => {
    const { container } = renderSpacer({ grow: true });
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe('');
  });
});
