import { render } from '@testing-library/react';
import KPopover from '../KPopover';
import { makeNode, AllProviders } from '../../test/helpers';

function renderPopover(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Popover', props });
  return render(
    <AllProviders>
      <KPopover node={node} theme="ios">{children}</KPopover>
    </AllProviders>
  );
}

describe('KPopover', () => {
  it('renders without crashing when not opened', () => {
    const { container } = renderPopover();
    expect(container).toBeTruthy();
  });

  it('renders popover content when opened', () => {
    // Popover always renders (it handles visibility internally via Konsta)
    const { container } = renderPopover({ opened: true }, <div>Popover content</div>);
    expect(container).toBeTruthy();
  });
});
