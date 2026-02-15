import { render, screen, fireEvent } from '@testing-library/react';
import ValidationPanel from './ValidationPanel';
import type { ValidationError } from '../utils/validation';

function makeError(message: string, path = 'root'): ValidationError {
  return { path, message, severity: 'error' };
}

function makeWarning(message: string, path = 'root'): ValidationError {
  return { path, message, severity: 'warning' };
}

describe('ValidationPanel', () => {
  it('returns null when there are no errors or warnings', () => {
    const { container } = render(
      <ValidationPanel errors={[]} warnings={[]} onClose={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders errors', () => {
    render(
      <ValidationPanel
        errors={[makeError('Something broke')]}
        warnings={[]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('Something broke')).toBeInTheDocument();
    expect(screen.getByText('1 error')).toBeInTheDocument();
  });

  it('renders warnings', () => {
    render(
      <ValidationPanel
        errors={[]}
        warnings={[makeWarning('Be careful')]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('Be careful')).toBeInTheDocument();
    expect(screen.getByText('1 warning')).toBeInTheDocument();
  });

  it('pluralizes error count correctly', () => {
    render(
      <ValidationPanel
        errors={[makeError('Error 1'), makeError('Error 2')]}
        warnings={[]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('2 errors')).toBeInTheDocument();
  });

  it('pluralizes warning count correctly', () => {
    render(
      <ValidationPanel
        errors={[]}
        warnings={[makeWarning('W1'), makeWarning('W2'), makeWarning('W3')]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('3 warnings')).toBeInTheDocument();
  });

  it('shows both errors and warnings together', () => {
    render(
      <ValidationPanel
        errors={[makeError('Err')]}
        warnings={[makeWarning('Warn')]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('1 error')).toBeInTheDocument();
    expect(screen.getByText('1 warning')).toBeInTheDocument();
    expect(screen.getByText('Err')).toBeInTheDocument();
    expect(screen.getByText('Warn')).toBeInTheDocument();
  });

  it('displays error path', () => {
    render(
      <ValidationPanel
        errors={[makeError('Bad thing', 'Button')]}
        warnings={[]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ValidationPanel
        errors={[makeError('Error')]}
        warnings={[]}
        onClose={onClose}
      />,
    );

    // The close button is the X icon button
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
