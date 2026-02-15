import { render, screen } from '@testing-library/react';
import KMediaCard from '../KMediaCard';
import { makeNode } from '../../test/helpers';

function renderMediaCard(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'MediaCard', props });
  return render(<KMediaCard node={node} theme="ios">{children}</KMediaCard>);
}

describe('KMediaCard', () => {
  it('renders title', () => {
    renderMediaCard({ title: 'Card Title' });
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    renderMediaCard({ title: 'Title', subtitle: 'Subtitle' });
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('renders image', () => {
    const { container } = renderMediaCard({ title: 'Title', image: 'https://example.com/img.jpg' });
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/img.jpg');
  });

  it('renders rating', () => {
    renderMediaCard({ title: 'Title', rating: '4.5' });
    expect(screen.getByText('4.5 ★')).toBeInTheDocument();
  });

  it('renders tags', () => {
    renderMediaCard({ title: 'Title', tags: ['food', 'travel'] });
    expect(screen.getByText('food')).toBeInTheDocument();
    expect(screen.getByText('travel')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderMediaCard({ title: 'Title', footer: 'Card footer' });
    expect(screen.getByText('Card footer')).toBeInTheDocument();
  });

  it('renders children', () => {
    renderMediaCard({ title: 'Title' }, <span>Extra content</span>);
    expect(screen.getByText('Extra content')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderMediaCard();
    expect(container.firstChild).toBeTruthy();
  });
});
