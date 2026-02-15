import { render } from '@testing-library/react';
import KStepper from '../KStepper';
import { makeNode } from '../../test/helpers';

function renderStepper(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Stepper', props });
  return render(<KStepper node={node} theme="ios" />);
}

describe('KStepper', () => {
  it('renders without crashing', () => {
    const { container } = renderStepper();
    expect(container.firstChild).toBeTruthy();
  });

  it('applies fill class', () => {
    const { container } = renderStepper({ fill: true });
    expect(container.firstChild).toHaveClass('flex-1');
  });

  it('applies custom className', () => {
    const { container } = renderStepper({ className: 'my-stepper' });
    expect(container.firstChild).toHaveClass('my-stepper');
  });
});
