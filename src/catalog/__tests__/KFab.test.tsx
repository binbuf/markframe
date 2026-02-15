import { render, screen, fireEvent } from '@testing-library/react';
import KFab from '../KFab';
import { makeNode, renderWithProviders } from '../../test/helpers';

function renderFab(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Fab', props });
  return renderWithProviders(<KFab node={node} theme="ios" />);
}

describe('KFab', () => {
  it('renders without crashing', () => {
    const { container } = renderFab();
    expect(container.firstChild).toBeTruthy();
  });

  it('renders icon', () => {
    const { container } = renderFab({ icon: 'add' });
    const icon = container.querySelector('ion-icon');
    expect(icon?.getAttribute('name')).toBe('add');
  });

  it('renders text', () => {
    renderFab({ text: 'New' });
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies fixed positioning when position is set', () => {
    const { container } = renderFab({ icon: 'add', position: 'right-bottom' });
    expect(container.querySelector('.fixed')).toBeTruthy();
    expect(container.querySelector('.right-4')).toBeTruthy();
  });

  it('applies left positioning', () => {
    const { container } = renderFab({ icon: 'add', position: 'left-bottom' });
    expect(container.querySelector('.left-4')).toBeTruthy();
  });

  it('handles click without navigation', () => {
    const { container } = renderFab({ icon: 'add' });
    const fab = container.querySelector('.k-fab');
    if (fab) fireEvent.click(fab);
  });
});
