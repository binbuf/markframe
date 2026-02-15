import { render, screen } from '@testing-library/react';
import KCheckbox from '../KCheckbox';
import { makeNode } from '../../test/helpers';

function renderCheckbox(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Checkbox', props });
  return render(<KCheckbox node={node} theme="ios" />);
}

describe('KCheckbox', () => {
  it('renders with default label', () => {
    renderCheckbox();
    expect(screen.getByText('Checkbox')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    renderCheckbox({ label: 'Accept terms' });
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders description as after text', () => {
    renderCheckbox({ label: 'Option', description: 'Details here' });
    expect(screen.getByText('Details here')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderCheckbox();
    expect(container.firstChild).toBeTruthy();
  });
});
