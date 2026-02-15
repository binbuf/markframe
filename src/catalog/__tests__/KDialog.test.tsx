import { render, screen } from '@testing-library/react';
import KDialog from '../KDialog';
import { makeNode, AllProviders } from '../../test/helpers';

function renderDialog(props: Record<string, unknown> = {}, nodeOverrides: Partial<ReturnType<typeof makeNode>> = {}) {
  const node = makeNode({ type: 'Dialog', props, ...nodeOverrides });
  return render(
    <AllProviders>
      <KDialog node={node} theme="ios" />
    </AllProviders>
  );
}

describe('KDialog', () => {
  it('renders nothing when not opened', () => {
    const { container } = renderDialog({ title: 'Alert' });
    expect(container.textContent).toBe('');
  });

  it('renders title and content when opened', () => {
    renderDialog({ title: 'Alert', content: 'Are you sure?', opened: true });
    expect(screen.getByText('Alert')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('renders default buttons when no children', () => {
    renderDialog({ title: 'Alert', opened: true });
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('renders buttons from child DialogButton nodes', () => {
    renderDialog({ title: 'Confirm', opened: true }, {
      children: [
        makeNode({ id: 'btn-1', type: 'DialogButton', props: { label: 'No' } }),
        makeNode({ id: 'btn-2', type: 'DialogButton', props: { label: 'Yes', strong: true } }),
      ],
    });
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('renders destructive button with red class', () => {
    const { container } = renderDialog({ title: 'Delete', opened: true }, {
      children: [
        makeNode({ id: 'btn-1', type: 'DialogButton', props: { label: 'Delete', destructive: true } }),
      ],
    });
    expect(container.querySelector('.text-red-500')).toBeTruthy();
  });
});
