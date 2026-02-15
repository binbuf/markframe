import { render, screen } from '@testing-library/react';
import KText from '../KText';
import { makeNode } from '../../test/helpers';

function renderText(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Text', props });
  return render(<KText node={node} theme="ios">{children}</KText>);
}

describe('KText', () => {
  it('renders text prop', () => {
    renderText({ text: 'Hello' });
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders children when no text prop', () => {
    renderText({}, 'Child text');
    expect(screen.getByText('Child text')).toBeInTheDocument();
  });

  it('renders caption variant with text-xs', () => {
    const { container } = renderText({ text: 'Caption', variant: 'caption' });
    expect(container.firstChild).toHaveClass('text-xs');
  });

  it('renders subtitle variant with text-sm font-medium', () => {
    const { container } = renderText({ text: 'Sub', variant: 'subtitle' });
    expect(container.firstChild).toHaveClass('text-sm', 'font-medium');
  });

  it('renders body text with text-sm by default', () => {
    const { container } = renderText({ text: 'Body' });
    expect(container.firstChild).toHaveClass('text-sm');
  });

  it('renders newlines as <br />', () => {
    const { container } = renderText({ text: 'Line 1\nLine 2' });
    const brs = container.querySelectorAll('br');
    expect(brs.length).toBe(1);
  });

  it('applies bold class', () => {
    const { container } = renderText({ text: 'Bold', bold: true });
    expect(container.firstChild).toHaveClass('font-bold');
  });

  it('applies color class', () => {
    const { container } = renderText({ text: 'Blue', color: 'blue' });
    expect(container.firstChild).toHaveClass('text-blue-500');
  });

  it('handles white color without -500 suffix', () => {
    const { container } = renderText({ text: 'White', color: 'white' });
    expect(container.firstChild).toHaveClass('text-white');
  });

  it('applies align class', () => {
    const { container } = renderText({ text: 'Center', align: 'center' });
    expect(container.firstChild).toHaveClass('text-center');
  });

  it('applies mono class', () => {
    const { container } = renderText({ text: 'Code', mono: true });
    expect(container.firstChild).toHaveClass('font-mono');
  });

  it('applies numeric size as arbitrary value', () => {
    const { container } = renderText({ text: 'Big', size: 24 });
    expect(container.firstChild).toHaveClass('text-[24px]');
  });

  it('applies named size as tailwind class', () => {
    const { container } = renderText({ text: 'LG', size: 'lg' });
    expect(container.firstChild).toHaveClass('text-lg');
  });

  it('renders without crashing with no props', () => {
    const { container } = renderText();
    expect(container.firstChild).toBeTruthy();
  });
});
