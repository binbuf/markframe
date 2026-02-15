import { render, screen, fireEvent } from '@testing-library/react';
import KButton from '../KButton';
import { makeNode, renderWithProviders } from '../../test/helpers';

function renderButton(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Button', props });
  return renderWithProviders(<KButton node={node} theme="ios">{children}</KButton>);
}

describe('KButton', () => {
  it('renders with label', () => {
    renderButton({ label: 'Click me' });
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders children when no label', () => {
    renderButton({}, <span>Child text</span>);
    expect(screen.getByText('Child text')).toBeInTheDocument();
  });

  it('label takes precedence over children', () => {
    renderButton({ label: 'Label' }, <span>Child</span>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('wraps non-inline buttons in a div with px-4 my-2', () => {
    const { container } = renderButton({ label: 'Test' });
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper).toHaveClass('px-4', 'my-2');
  });

  it('does not wrap inline buttons in a div', () => {
    const { container } = renderButton({ label: 'Inline', inline: true });
    // Inline buttons render without the wrapper div — first child is the button itself
    const firstChild = container.firstChild as HTMLElement;
    expect(firstChild).toHaveClass('k-button');
    expect(firstChild).not.toHaveClass('my-2');
  });

  it('applies fill class when fill=true', () => {
    const { container } = renderButton({ label: 'Fill', fill: true });
    expect(container.firstChild).toHaveClass('flex-1');
  });

  it('applies push class when push=true', () => {
    const { container } = renderButton({ label: 'Push', push: true });
    expect(container.firstChild).toHaveClass('ml-auto');
  });

  it('applies margin styles', () => {
    const { container } = renderButton({ label: 'Margin', mt: 4, mb: 8 });
    expect(container.firstChild).toHaveStyle({
      marginTop: '1rem',
      marginBottom: '2rem',
    });
  });

  it('renders without crashing with no props', () => {
    const { container } = renderButton();
    expect(container.firstChild).toBeTruthy();
  });

  it('handles click without navigation', () => {
    renderButton({ label: 'Click' });
    const btn = screen.getByText('Click');
    expect(() => fireEvent.click(btn)).not.toThrow();
  });
});
