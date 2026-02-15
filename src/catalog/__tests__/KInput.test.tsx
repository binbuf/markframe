import { render, screen } from '@testing-library/react';
import KInput from '../KInput';
import { makeNode } from '../../test/helpers';

function renderInput(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'TextField', props });
  return render(<KInput node={node} theme="ios" />);
}

describe('KInput', () => {
  it('renders with label', () => {
    renderInput({ label: 'Email' });
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    renderInput({ placeholder: 'Enter email...' });
    expect(screen.getByPlaceholderText('Enter email...')).toBeInTheDocument();
  });

  it('renders with value', () => {
    const { container } = renderInput({ value: 'test@example.com' });
    const input = container.querySelector('input');
    expect(input?.value).toBe('test@example.com');
  });

  it('renders without crashing with no props', () => {
    const { container } = renderInput();
    expect(container.firstChild).toBeTruthy();
  });

  it('applies fill class', () => {
    const { container } = renderInput({ fill: true });
    expect(container.firstChild).toHaveClass('flex-1');
  });

  it('renders media icon when media prop is set', () => {
    const { container } = renderInput({ media: 'mail' });
    const icon = container.querySelector('ion-icon');
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('name')).toBe('mail');
  });
});
