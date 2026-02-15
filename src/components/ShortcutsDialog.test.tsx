import { render, screen, fireEvent } from '@testing-library/react';
import ShortcutsDialog from './ShortcutsDialog';

describe('ShortcutsDialog', () => {
  it('renders the dialog title', () => {
    render(<ShortcutsDialog onClose={() => {}} />);
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('renders shortcut categories', () => {
    render(<ShortcutsDialog onClose={() => {}} />);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('renders shortcut descriptions', () => {
    render(<ShortcutsDialog onClose={() => {}} />);
    expect(screen.getByText('Open project')).toBeInTheDocument();
    expect(screen.getByText('Save project')).toBeInTheDocument();
  });

  it('renders keyboard shortcut keys as kbd elements', () => {
    const { container } = render(<ShortcutsDialog onClose={() => {}} />);
    const kbdElements = container.querySelectorAll('kbd');
    // At least one per shortcut plus the Esc hint in the footer
    expect(kbdElements.length).toBeGreaterThan(5);
  });

  it('shows Esc instruction in footer', () => {
    render(<ShortcutsDialog onClose={() => {}} />);
    expect(screen.getByText(/to close/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ShortcutsDialog onClose={onClose} />);

    // Close button has the X icon
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<ShortcutsDialog onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<ShortcutsDialog onClose={onClose} />);

    // The backdrop is the outermost div with the fixed class
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when dialog content is clicked', () => {
    const onClose = vi.fn();
    render(<ShortcutsDialog onClose={onClose} />);

    fireEvent.click(screen.getByText('Keyboard Shortcuts'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
