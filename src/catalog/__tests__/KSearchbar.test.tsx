import { render } from '@testing-library/react';
import KSearchbar from '../KSearchbar';
import { makeNode } from '../../test/helpers';

function renderSearchbar(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Searchbar', props });
  return render(<KSearchbar node={node} theme="ios" />);
}

describe('KSearchbar', () => {
  it('renders without crashing', () => {
    const { container } = renderSearchbar();
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const { container } = renderSearchbar({ placeholder: 'Find items...' });
    const input = container.querySelector('input');
    expect(input?.getAttribute('placeholder')).toBe('Find items...');
  });

  it('renders with default placeholder', () => {
    const { container } = renderSearchbar();
    const input = container.querySelector('input');
    expect(input?.getAttribute('placeholder')).toBe('Search');
  });
});
