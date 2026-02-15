import { render, screen } from '@testing-library/react';
import KStat from '../KStat';
import { makeNode } from '../../test/helpers';

function renderStat(props: Record<string, unknown> = {}) {
  const node = makeNode({ type: 'Stat', props });
  return render(<KStat node={node} theme="ios" />);
}

describe('KStat', () => {
  it('renders value', () => {
    renderStat({ value: '1,234' });
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders label', () => {
    renderStat({ value: '42', label: 'Users' });
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders trend', () => {
    renderStat({ value: '100', trend: '+12%' });
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('applies green color to positive trend', () => {
    const { container } = renderStat({ value: '100', trend: '+12%' });
    expect(container.querySelector('.text-green-500')).toBeTruthy();
  });

  it('applies red color to negative trend', () => {
    const { container } = renderStat({ value: '100', trend: '-5%' });
    expect(container.querySelector('.text-red-500')).toBeTruthy();
  });

  it('renders icon', () => {
    const { container } = renderStat({ value: '42', icon: 'people' });
    const icon = container.querySelector('ion-icon');
    expect(icon?.getAttribute('name')).toBe('people');
  });

  it('renders without crashing with no props', () => {
    const { container } = renderStat();
    expect(container.firstChild).toBeTruthy();
  });

  it('applies color to value with Tailwind color', () => {
    const { container } = renderStat({ value: '100', color: 'green-300' });
    const valueElement = screen.getByText('100');
    expect(valueElement).toHaveStyle({ color: '#86efac' }); // green-300
  });

  it('applies labelColor to label', () => {
    renderStat({ value: '100', label: 'Steps', labelColor: 'white' });
    const labelElement = screen.getByText('Steps');
    expect(labelElement).toHaveStyle({ color: '#ffffff' });
  });

  it('uses default grey color for label when labelColor not specified', () => {
    const { container } = renderStat({ value: '100', label: 'Steps' });
    const labelElement = screen.getByText('Steps');
    expect(labelElement).toHaveClass('text-gray-500');
  });

  it('applies color to icon', () => {
    const { container } = renderStat({ value: '42', icon: 'people', color: 'blue-500' });
    const icon = container.querySelector('ion-icon');
    expect(icon?.getAttribute('style')).toContain('color: rgb(59, 130, 246)'); // blue-500
  });
});
