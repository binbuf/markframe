import { render, screen } from '@testing-library/react';
import KStoryRow from '../KStoryRow';
import { makeNode } from '../../test/helpers';

function renderStoryRow(props: Record<string, unknown> = {}, nodeOverrides: Partial<ReturnType<typeof makeNode>> = {}) {
  const node = makeNode({ type: 'StoryRow', props, ...nodeOverrides });
  return render(<KStoryRow node={node} theme="ios" />);
}

describe('KStoryRow', () => {
  it('renders without crashing', () => {
    const { container } = renderStoryRow();
    expect(container.firstChild).toBeTruthy();
  });

  it('renders Story children with labels', () => {
    renderStoryRow({}, {
      children: [
        makeNode({ id: 'story-1', type: 'Story', props: { label: 'Alice' } }),
        makeNode({ id: 'story-2', type: 'Story', props: { label: 'Bob' } }),
      ],
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders add button for add=true stories', () => {
    const { container } = renderStoryRow({}, {
      children: [
        makeNode({ id: 'story-1', type: 'Story', props: { label: 'Add', add: true } }),
      ],
    });
    const addIcon = container.querySelector('ion-icon[name="add"]');
    expect(addIcon).toBeTruthy();
  });

  it('renders horizontal scrolling row', () => {
    const { container } = renderStoryRow();
    expect(container.firstChild).toHaveClass('flex', 'flex-row', 'overflow-x-auto');
  });
});
