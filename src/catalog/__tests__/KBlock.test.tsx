import { render, screen } from '@testing-library/react';
import KBlock from '../KBlock';
import { makeNode } from '../../test/helpers';

function renderBlock(props: Record<string, unknown> = {}, children?: React.ReactNode) {
  const node = makeNode({ type: 'Block', props });
  return render(<KBlock node={node} theme="ios">{children}</KBlock>);
}

describe('KBlock', () => {
  it('renders children', () => {
    renderBlock({}, <span>Block content</span>);
    expect(screen.getByText('Block content')).toBeInTheDocument();
  });

  it('renders title variant', () => {
    renderBlock({ variant: 'title', text: 'Section Title' });
    expect(screen.getByText('Section Title')).toBeInTheDocument();
  });

  it('renders header variant', () => {
    renderBlock({ variant: 'header', text: 'Header' });
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders footer variant', () => {
    renderBlock({ variant: 'footer', text: 'Footer' });
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies flush classes', () => {
    const { container } = renderBlock({ flush: true }, <span>Content</span>);
    // The Block component should get flush override classes
    const block = container.querySelector('.\\!p-0');
    expect(block).toBeTruthy();
  });

  it('applies rounded class', () => {
    const { container } = renderBlock({ rounded: true }, <span>Content</span>);
    expect(container.querySelector('.rounded-lg')).toBeTruthy();
  });

  it('applies border class', () => {
    const { container } = renderBlock({ border: true }, <span>Content</span>);
    expect(container.querySelector('.border')).toBeTruthy();
  });

  it('applies fill class', () => {
    const { container } = renderBlock({ fill: true }, <span>Content</span>);
    expect(container.querySelector('.flex-1')).toBeTruthy();
  });

  it('applies width and height styles', () => {
    const { container } = renderBlock({ width: 200, height: 100 }, <span>Sized</span>);
    const block = container.querySelector('[style]');
    expect(block).toBeTruthy();
  });

  it('applies background color from bg prop', () => {
    const { container } = renderBlock({ bg: 'gray-100' }, <span>Content</span>);
    const block = container.querySelector('[style]') as HTMLElement;
    expect(block).toBeTruthy();
    expect(block?.style.backgroundColor).toBe('rgb(243, 244, 246)'); // #f3f4f6 as rgb
  });

  it('applies background color with hex value', () => {
    const { container } = renderBlock({ bg: '#ff0000' }, <span>Content</span>);
    const block = container.querySelector('[style]') as HTMLElement;
    expect(block).toBeTruthy();
    expect(block?.style.backgroundColor).toBe('rgb(255, 0, 0)'); // #ff0000 as rgb
  });

  it('renders without crashing with no props', () => {
    const { container } = renderBlock();
    expect(container.firstChild).toBeTruthy();
  });
});
