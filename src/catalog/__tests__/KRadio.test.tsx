import { render, screen } from '@testing-library/react';
import KRadio from '../KRadio';
import { makeNode } from '../../test/helpers';

function renderRadio(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Radio', props });
  return render(<KRadio node={node} theme="ios" />);
}

describe('KRadio', () => {
  it('renders with default label', () => {
    renderRadio();
    expect(screen.getByText('Radio')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    renderRadio({ label: 'Option A' });
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderRadio({ label: 'Option', description: 'Description' });
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderRadio();
    expect(container.firstChild).toBeTruthy();
  });
});
