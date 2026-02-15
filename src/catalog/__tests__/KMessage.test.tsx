import { render, screen } from '@testing-library/react';
import KMessage from '../KMessage';
import { makeNode } from '../../test/helpers';

function renderMessage(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Message', props });
  return render(<KMessage node={node} theme="ios" />);
}

describe('KMessage', () => {
  it('renders text', () => {
    renderMessage({ text: 'Hello there!' });
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });

  it('renders sent message aligned right', () => {
    const { container } = renderMessage({ text: 'Hi', sent: true });
    expect(container.querySelector('.justify-end')).toBeTruthy();
  });

  it('renders received message aligned left', () => {
    const { container } = renderMessage({ text: 'Hi' });
    expect(container.querySelector('.justify-end')).toBeNull();
  });

  it('renders time', () => {
    renderMessage({ text: 'Hi', time: '2:30 PM' });
    expect(screen.getByText('2:30 PM')).toBeInTheDocument();
  });

  it('renders read indicator on sent messages', () => {
    const { container } = renderMessage({ text: 'Hi', sent: true, read: true });
    expect(container.textContent).toContain('✓✓');
  });

  it('renders avatar on received messages', () => {
    const { container } = renderMessage({ text: 'Hi', avatar: 'https://example.com/face.jpg' });
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/face.jpg');
  });

  it('renders without crashing with no props', () => {
    const { container } = renderMessage();
    expect(container.firstChild).toBeTruthy();
  });
});
