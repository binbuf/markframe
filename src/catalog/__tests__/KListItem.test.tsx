import { render, screen } from '@testing-library/react';
import KListItem from '../KListItem';
import { makeNode, renderWithProviders } from '../../test/helpers';

function renderListItem(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'ListItem', props });
  return renderWithProviders(<KListItem node={node} theme="ios">{children}</KListItem>);
}

describe('KListItem', () => {
  it('renders with title', () => {
    renderListItem({ title: 'Item Title' });
    expect(screen.getByText('Item Title')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    renderListItem({ title: 'Title', subtitle: 'Subtitle text' });
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
  });

  it('renders after text', () => {
    renderListItem({ title: 'Title', after: 'Detail' });
    expect(screen.getByText('Detail')).toBeInTheDocument();
  });

  it('renders as header when header=true', () => {
    renderListItem({ title: 'Section', header: true });
    expect(screen.getByText('Section')).toBeInTheDocument();
  });

  it('renders badge', () => {
    renderListItem({ title: 'Title', badge: '5' });
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderListItem();
    expect(container.firstChild).toBeTruthy();
  });
});
