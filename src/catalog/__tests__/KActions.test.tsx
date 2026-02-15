import { render, screen } from '@testing-library/react';
import KActions from '../KActions';
import { makeNode, AllProviders } from '../../test/helpers';

function renderActions(props: Record<string, unknown> = {}, nodeOverrides: Partial<ReturnType<typeof makeNode>> = {}) {
  const node = makeNode({ type: 'Actions', props, ...nodeOverrides });
  return render(
    <AllProviders>
      <KActions node={node} theme="ios" />
    </AllProviders>
  );
}

describe('KActions', () => {
  it('renders nothing when not opened', () => {
    const { container } = renderActions();
    expect(container.textContent).toBe('');
  });

  it('renders title when opened', () => {
    renderActions({ title: 'Choose action', opened: true });
    expect(screen.getByText('Choose action')).toBeInTheDocument();
  });

  it('renders default Cancel button when no children', () => {
    renderActions({ opened: true });
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders buttons from child ActionsButton nodes', () => {
    renderActions({ opened: true }, {
      children: [
        makeNode({ id: 'btn-1', type: 'ActionsButton', props: { label: 'Share' } }),
        makeNode({ id: 'btn-2', type: 'ActionsButton', props: { label: 'Delete', destructive: true } }),
      ],
    });
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders grouped buttons from ActionsGroup children', () => {
    renderActions({ opened: true }, {
      children: [
        makeNode({
          id: 'group-1', type: 'ActionsGroup', children: [
            makeNode({ id: 'btn-1', type: 'ActionsButton', props: { label: 'Edit' } }),
          ],
        }),
      ],
    });
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
