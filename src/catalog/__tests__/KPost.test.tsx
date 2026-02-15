import { render, screen } from '@testing-library/react';
import KPost from '../KPost';
import { makeNode } from '../../test/helpers';

function renderPost(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Post', props });
  return render(<KPost node={node} theme="ios" />);
}

describe('KPost', () => {
  it('renders author name', () => {
    renderPost({ author: 'John Doe' });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders post text', () => {
    renderPost({ text: 'Hello world!' });
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });

  it('renders time', () => {
    renderPost({ author: 'User', time: '5m' });
    expect(screen.getByText('· 5m')).toBeInTheDocument();
  });

  it('renders verified badge', () => {
    const { container } = renderPost({ author: 'User', verified: true });
    const checkIcon = container.querySelector('ion-icon[name="checkmark-circle"]');
    expect(checkIcon).toBeTruthy();
  });

  it('renders likes count', () => {
    renderPost({ text: 'Hi', likes: '42' });
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders comments count', () => {
    renderPost({ text: 'Hi', comments: '10' });
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderPost();
    expect(container.firstChild).toBeTruthy();
  });
});
