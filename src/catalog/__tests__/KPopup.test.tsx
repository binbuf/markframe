import { render, screen } from '@testing-library/react';
import KPopup from '../KPopup';
import { makeNode, AllProviders } from '../../test/helpers';

function renderPopup(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Popup', props });
  return render(
    <AllProviders>
      <KPopup node={node} theme="ios">{children}</KPopup>
    </AllProviders>
  );
}

describe('KPopup', () => {
  it('renders nothing when not opened', () => {
    const { container } = renderPopup({}, <div>Popup content</div>);
    expect(container.textContent).toBe('');
  });

  it('renders children when opened', () => {
    renderPopup({ opened: true }, <div>Popup content</div>);
    expect(screen.getByText('Popup content')).toBeInTheDocument();
  });

  it('renders close button and title', () => {
    renderPopup({ opened: true, title: 'My Popup' });
    expect(screen.getByText('My Popup')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('hides close button when closeButton=false', () => {
    renderPopup({ opened: true, closeButton: false });
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });
});
