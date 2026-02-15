import { render, screen } from '@testing-library/react';
import KPanel from '../KPanel';
import { makeNode, AllProviders } from '../../test/helpers';

function renderPanel(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Panel', props });
  return render(
    <AllProviders>
      <KPanel node={node} theme="ios">{children}</KPanel>
    </AllProviders>
  );
}

describe('KPanel', () => {
  it('renders nothing when not opened', () => {
    const { container } = renderPanel({}, <div>Panel content</div>);
    expect(container.textContent).toBe('');
  });

  it('renders children when opened', () => {
    renderPanel({ opened: true }, <div>Panel content</div>);
    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });

  it('renders without crashing with no children when opened', () => {
    const { container } = renderPanel({ opened: true });
    expect(container.firstChild).toBeTruthy();
  });
});
