import { render, screen, fireEvent } from '@testing-library/react';
import WelcomeScreen from './WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders the markframe title', () => {
    render(<WelcomeScreen onNewProject={() => {}} onOpenFile={() => {}} />);
    expect(screen.getByText('markframe')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<WelcomeScreen onNewProject={() => {}} onOpenFile={() => {}} />);
    expect(screen.getByText(/Declarative mobile UI/)).toBeInTheDocument();
  });

  it('renders New Project and Open File buttons', () => {
    render(<WelcomeScreen onNewProject={() => {}} onOpenFile={() => {}} />);
    expect(screen.getByText('New Project')).toBeInTheDocument();
    expect(screen.getByText('Open File')).toBeInTheDocument();
  });

  it('calls onOpenFile when Open File button is clicked', () => {
    const onOpenFile = vi.fn();
    render(<WelcomeScreen onNewProject={() => {}} onOpenFile={onOpenFile} />);

    fireEvent.click(screen.getByText('Open File'));
    expect(onOpenFile).toHaveBeenCalledTimes(1);
  });

  it('shows blueprint picker when New Project is clicked', () => {
    render(<WelcomeScreen onNewProject={() => {}} onOpenFile={() => {}} />);

    // Blueprint picker should not be visible initially
    expect(screen.queryByText('Choose a Blueprint')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('New Project'));

    // Now the picker should be visible
    expect(screen.getByText('Choose a Blueprint')).toBeInTheDocument();
  });

  it('renders all blueprints in the picker', () => {
    render(<WelcomeScreen onNewProject={() => {}} onOpenFile={() => {}} />);

    fireEvent.click(screen.getByText('New Project'));

    // Should show at least the Blank Project
    expect(screen.getByText('Blank Project')).toBeInTheDocument();
    expect(screen.getByText('Empty starting point')).toBeInTheDocument();
  });

  it('calls onNewProject with blueprint data when a blueprint is selected', () => {
    const onNewProject = vi.fn();
    render(<WelcomeScreen onNewProject={onNewProject} onOpenFile={() => {}} />);

    fireEvent.click(screen.getByText('New Project'));
    fireEvent.click(screen.getByText('Blank Project'));

    expect(onNewProject).toHaveBeenCalledTimes(1);
    expect(onNewProject).toHaveBeenCalledWith(expect.any(String));
  });

  it('closes blueprint picker when X is clicked', () => {
    render(<WelcomeScreen onNewProject={() => {}} onOpenFile={() => {}} />);

    fireEvent.click(screen.getByText('New Project'));
    expect(screen.getByText('Choose a Blueprint')).toBeInTheDocument();

    // Click the X button in the blueprint modal
    const closeButtons = screen.getAllByRole('button');
    // Find the close button (the one with X icon in the modal header)
    const closeBtn = closeButtons.find(btn =>
      btn.closest('.flex.items-center.justify-between')?.querySelector('h2')
    );
    if (closeBtn) fireEvent.click(closeBtn);

    expect(screen.queryByText('Choose a Blueprint')).not.toBeInTheDocument();
  });
});
