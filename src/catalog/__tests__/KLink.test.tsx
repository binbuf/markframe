import { render, screen, fireEvent } from '@testing-library/react';
import KLink from '../KLink';
import { makeNode, renderWithProviders } from '../../test/helpers';

function renderLink(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Link', props });
  return renderWithProviders(<KLink node={node} theme="ios">{children}</KLink>);
}

describe('KLink', () => {
  it('renders with text prop', () => {
    renderLink({ text: 'Click here' });
    expect(screen.getByText('Click here')).toBeInTheDocument();
  });

  it('renders children when no text prop', () => {
    renderLink({}, <span>Link child</span>);
    expect(screen.getByText('Link child')).toBeInTheDocument();
  });

  it('renders without crashing with no props', () => {
    const { container } = renderLink();
    expect(container.firstChild).toBeTruthy();
  });

  it('applies push class when push=true', () => {
    const { container } = renderLink({ text: 'Push', push: true });
    expect(container.querySelector('.ml-auto')).toBeTruthy();
  });

  it('renders left icon when iconLeft provided', () => {
    const { container } = renderLink({ text: 'Link', iconLeft: 'home' });
    const icon = container.querySelector('ion-icon');
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('name')).toBe('home');
  });

  it('renders right icon when iconRight provided', () => {
    const { container } = renderLink({ text: 'Link', iconRight: 'chevron-forward' });
    const icons = container.querySelectorAll('ion-icon');
    expect(icons.length).toBe(1);
    expect(icons[0].getAttribute('name')).toBe('chevron-forward');
  });

  it('supports icon prop as alias for iconLeft', () => {
    const { container } = renderLink({ text: 'Link', icon: 'star' });
    const icon = container.querySelector('ion-icon');
    expect(icon?.getAttribute('name')).toBe('star');
  });

  it('handles click with navigateTo', () => {
    renderLink({ text: 'Go', navigateTo: 'page-2' });
    const link = screen.getByText('Go');
    expect(() => fireEvent.click(link)).not.toThrow();
  });
});
