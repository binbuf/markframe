import { render, screen, fireEvent } from '@testing-library/react';
import Toolbar from './Toolbar';
import { ZOOM_LEVELS } from '../engine/useMarkframe';
import type { DeviceSpec, DeviceOrientation } from '../types/device';

const testDevice: DeviceSpec = {
  id: 'iphone-15-pro',
  name: 'iPhone 15 Pro',
  shortName: 'iPhone 15 Pro',
  platform: 'ios',
  formFactor: 'phone',
  dimensions: { width: 393, height: 852, scale: 3 },
  safeArea: { top: 59, bottom: 34 },
  features: { dynamicIsland: true, roundedCorners: true, borderRadius: 55 },
  frame: { borderWidth: 1, borderColor: '#333', shadow: 'none', backgroundColor: '#000' },
};

const androidDevice: DeviceSpec = {
  id: 'pixel-8',
  name: 'Pixel 8',
  shortName: 'Pixel 8',
  platform: 'android',
  formFactor: 'phone',
  dimensions: { width: 412, height: 915, scale: 2.625 },
  safeArea: { top: 36, bottom: 0 },
  features: { punchHole: 'center', punchHoleDiameter: 20, roundedCorners: true, borderRadius: 40 },
  frame: { borderWidth: 1, borderColor: '#333', shadow: 'none', backgroundColor: '#000' },
};

const tabletDevice: DeviceSpec = {
  id: 'ipad-pro-13',
  name: 'iPad Pro 13"',
  shortName: 'iPad Pro 13"',
  platform: 'ios',
  formFactor: 'tablet',
  dimensions: { width: 1024, height: 1366, scale: 2 },
  safeArea: { top: 24, bottom: 20 },
  features: { roundedCorners: true, borderRadius: 30 },
  frame: { borderWidth: 1, borderColor: '#333', shadow: 'none', backgroundColor: '#000' },
};

const defaultProps = {
  surfaces: [
    { id: '1', surfaceId: 'home', label: 'Home' },
    { id: '2', surfaceId: 'settings', label: 'Settings' },
  ],
  activeSurfaceId: 'home',
  onSurfaceChange: vi.fn(),
  theme: 'ios' as const,
  onOpen: vi.fn(),
  onSave: vi.fn(),
  onClose: vi.fn(),
  fileName: null,
  selectedDevice: testDevice,
  onDeviceChange: vi.fn(),
  availableDevices: [testDevice, androidDevice, tabletDevice],
  orientation: 'portrait' as DeviceOrientation,
  onOrientationChange: vi.fn(),
  zoom: 1.0,
  onZoomChange: vi.fn(),
  onShowShortcuts: vi.fn(),
  onToggleEditor: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Toolbar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toolbar {...defaultProps} />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('displays the markframe branding', () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText('markframe')).toBeInTheDocument();
  });

  it('displays file name when provided', () => {
    render(<Toolbar {...defaultProps} fileName="my-project.mf" />);
    expect(screen.getByText('my-project.mf')).toBeInTheDocument();
  });

  it('does not display file name when null', () => {
    const { container } = render(<Toolbar {...defaultProps} fileName={null} />);
    expect(container.querySelector('.truncate')).toBeNull();
  });

  it('displays theme indicator', () => {
    render(<Toolbar {...defaultProps} theme="ios" />);
    expect(screen.getByText('iOS')).toBeInTheDocument();
  });

  it('displays Material theme indicator', () => {
    render(<Toolbar {...defaultProps} theme="material" />);
    expect(screen.getByText('Material')).toBeInTheDocument();
  });

  it('displays current zoom percentage', () => {
    render(<Toolbar {...defaultProps} zoom={0.75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  describe('file actions', () => {
    it('calls onOpen when open button is clicked', () => {
      render(<Toolbar {...defaultProps} />);
      const openBtn = screen.getByTitle(/Open/);
      fireEvent.click(openBtn);
      expect(defaultProps.onOpen).toHaveBeenCalledTimes(1);
    });

    it('calls onSave when save button is clicked', () => {
      render(<Toolbar {...defaultProps} />);
      const saveBtn = screen.getByTitle(/Save/);
      fireEvent.click(saveBtn);
      expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when close button is clicked', () => {
      render(<Toolbar {...defaultProps} />);
      const closeBtn = screen.getByTitle('Close Project');
      fireEvent.click(closeBtn);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('orientation toggle', () => {
    it('calls onOrientationChange with landscape when currently portrait', () => {
      render(<Toolbar {...defaultProps} orientation="portrait" />);
      const rotateBtn = screen.getByTitle(/Switch to Landscape/);
      fireEvent.click(rotateBtn);
      expect(defaultProps.onOrientationChange).toHaveBeenCalledWith('landscape');
    });

    it('calls onOrientationChange with portrait when currently landscape', () => {
      render(<Toolbar {...defaultProps} orientation="landscape" />);
      const rotateBtn = screen.getByTitle(/Switch to Portrait/);
      fireEvent.click(rotateBtn);
      expect(defaultProps.onOrientationChange).toHaveBeenCalledWith('portrait');
    });
  });

  describe('zoom controls', () => {
    it('calls onZoomChange with next zoom level on zoom in', () => {
      render(<Toolbar {...defaultProps} zoom={1.0} />);
      const zoomInBtn = screen.getByTitle(/Zoom In/);
      fireEvent.click(zoomInBtn);
      expect(defaultProps.onZoomChange).toHaveBeenCalledWith(1.25);
    });

    it('calls onZoomChange with previous zoom level on zoom out', () => {
      render(<Toolbar {...defaultProps} zoom={1.0} />);
      const zoomOutBtn = screen.getByTitle(/Zoom Out/);
      fireEvent.click(zoomOutBtn);
      expect(defaultProps.onZoomChange).toHaveBeenCalledWith(0.75);
    });

    it('resets zoom to 1.0 when zoom display is clicked', () => {
      render(<Toolbar {...defaultProps} zoom={0.75} />);
      const resetBtn = screen.getByTitle(/Reset Zoom/);
      fireEvent.click(resetBtn);
      expect(defaultProps.onZoomChange).toHaveBeenCalledWith(1.0);
    });

    it('disables zoom in at max level', () => {
      const maxZoom = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
      render(<Toolbar {...defaultProps} zoom={maxZoom} />);
      const zoomInBtn = screen.getByTitle(/Zoom In/);
      expect(zoomInBtn).toBeDisabled();
    });

    it('disables zoom out at min level', () => {
      const minZoom = ZOOM_LEVELS[0];
      render(<Toolbar {...defaultProps} zoom={minZoom} />);
      const zoomOutBtn = screen.getByTitle(/Zoom Out/);
      expect(zoomOutBtn).toBeDisabled();
    });
  });

  describe('device selector', () => {
    it('renders device dropdown with current device selected', () => {
      render(<Toolbar {...defaultProps} />);
      const select = screen.getAllByRole('combobox')[0];
      expect(select).toHaveValue('iphone-15-pro');
    });

    it('calls onDeviceChange when a different device is selected', () => {
      render(<Toolbar {...defaultProps} />);
      const select = screen.getAllByRole('combobox')[0];
      fireEvent.change(select, { target: { value: 'pixel-8' } });
      expect(defaultProps.onDeviceChange).toHaveBeenCalledWith(androidDevice);
    });
  });

  describe('surface selector', () => {
    it('renders surface options', () => {
      render(<Toolbar {...defaultProps} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('calls onSurfaceChange when a different surface is selected', () => {
      render(<Toolbar {...defaultProps} />);
      const surfaceSelect = screen.getAllByRole('combobox')[1];
      fireEvent.change(surfaceSelect, { target: { value: 'settings' } });
      expect(defaultProps.onSurfaceChange).toHaveBeenCalledWith('settings');
    });

    it('disables surface selector when no surfaces', () => {
      render(<Toolbar {...defaultProps} surfaces={[]} />);
      const surfaceSelect = screen.getAllByRole('combobox')[1];
      expect(surfaceSelect).toBeDisabled();
    });

    it('shows "No surfaces" when surfaces array is empty', () => {
      render(<Toolbar {...defaultProps} surfaces={[]} />);
      expect(screen.getByText('No surfaces')).toBeInTheDocument();
    });
  });

  describe('shortcuts button', () => {
    it('calls onShowShortcuts when help button is clicked', () => {
      render(<Toolbar {...defaultProps} />);
      const helpBtn = screen.getByTitle(/Keyboard Shortcuts/);
      fireEvent.click(helpBtn);
      expect(defaultProps.onShowShortcuts).toHaveBeenCalledTimes(1);
    });
  });

  describe('editor toggle', () => {
    it('calls onToggleEditor when menu button is clicked', () => {
      render(<Toolbar {...defaultProps} />);
      // The menu button is the first button
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);
      expect(defaultProps.onToggleEditor).toHaveBeenCalledTimes(1);
    });
  });
});
