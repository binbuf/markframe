import { render, screen } from '@testing-library/react';
import KChip from '../KChip';
import { makeNode } from '../../test/helpers';

function renderChip(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Chip', props });
  return render(<KChip node={node} theme="ios">{children}</KChip>);
}

describe('KChip', () => {
  it('renders text prop', () => {
    renderChip({ text: 'Tag' });
    expect(screen.getByText('Tag')).toBeInTheDocument();
  });

  it('renders children when no text', () => {
    renderChip({}, 'Child tag');
    expect(screen.getByText('Child tag')).toBeInTheDocument();
  });

  it('applies color classes for fill variant', () => {
    const { container } = renderChip({ text: 'Red', color: 'red' });
    expect(container.querySelector('.bg-red-500')).toBeTruthy();
  });

  it('applies outline color classes', () => {
    const { container } = renderChip({ text: 'Blue', color: 'blue', outline: true });
    expect(container.querySelector('.text-blue-500')).toBeTruthy();
  });

  it('renders media icon', () => {
    const { container } = renderChip({ text: 'Tag', media: 'star' });
    const icon = container.querySelector('ion-icon');
    expect(icon).toBeTruthy();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderChip();
    expect(container.firstChild).toBeTruthy();
  });
});
