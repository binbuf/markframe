import { screen, fireEvent } from '@testing-library/react';
import KCard from '../KCard';
import { makeNode, renderWithProviders } from '../../test/helpers';

function renderCard(
  props: Record<string, unknown> = {},
  children?: React.ReactNode,
  options?: { navigate?: (id: string) => void },
) {
  const node = makeNode({ type: 'Card', props });
  return renderWithProviders(
    <KCard node={node} theme="ios">{children}</KCard>,
    options,
  );
}

describe('KCard', () => {
  it('renders with title', () => {
    renderCard({ title: 'Card Title' });
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders content prop as text', () => {
    renderCard({ content: 'Card content text' });
    expect(screen.getByText('Card content text')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderCard({ footer: 'Footer text' });
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('renders children when no content prop', () => {
    renderCard({}, <span>Child content</span>);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('applies flush classes', () => {
    const { container } = renderCard({ flush: true }, <span>Content</span>);
    expect(container.querySelector('.\\!p-0')).toBeTruthy();
  });

  it('applies width style', () => {
    const { container } = renderCard({ width: 300 });
    const card = container.querySelector('[style]') as HTMLElement;
    expect(card?.style.width).toBe('300px');
  });

  it('applies background color from bg prop', () => {
    const { container } = renderCard({ bg: 'blue-600' });
    const card = container.querySelector('[style]') as HTMLElement;
    expect(card).toBeTruthy();
    expect(card?.style.backgroundColor).toBe('rgb(37, 99, 235)'); // #2563eb as rgb
  });

  it('applies background color with hex value', () => {
    const { container } = renderCard({ bg: '#00ff00' });
    const card = container.querySelector('[style]') as HTMLElement;
    expect(card).toBeTruthy();
    expect(card?.style.backgroundColor).toBe('rgb(0, 255, 0)'); // #00ff00 as rgb
  });

  it('renders without crashing with no props', () => {
    const { container } = renderCard();
    expect(container.firstChild).toBeTruthy();
  });

  it('calls navigate when card has navigateTo and is clicked', () => {
    const navigate = vi.fn();
    const { container } = renderCard(
      { navigateTo: 'user-info', title: 'Go' },
      undefined,
      { navigate },
    );
    const card = container.querySelector('.k-card') as HTMLElement;
    fireEvent.click(card);
    expect(navigate).toHaveBeenCalledWith('user-info');
  });

  it('applies pointer cursor when navigateTo is set', () => {
    const { container } = renderCard({ navigateTo: 'user-info' });
    const card = container.querySelector('[style]') as HTMLElement;
    expect(card?.style.cursor).toBe('pointer');
  });

  it('does not call navigate when card has no navigateTo', () => {
    const navigate = vi.fn();
    const { container } = renderCard(
      { title: 'Static' },
      undefined,
      { navigate },
    );
    const card = container.querySelector('.k-card') as HTMLElement;
    fireEvent.click(card);
    expect(navigate).not.toHaveBeenCalled();
  });
});
