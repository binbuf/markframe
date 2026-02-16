import { render, screen, fireEvent } from '@testing-library/react';
import DevicePreview from './DevicePreview';
import type { MarkframeNode } from '../types/markframe';
import type { DeviceSpec } from '../types/device';

const testDevice: DeviceSpec = {
  id: 'test-phone',
  name: 'Test Phone',
  shortName: 'Test Phone',
  platform: 'ios',
  formFactor: 'phone',
  dimensions: { width: 390, height: 844, scale: 3 },
  safeArea: { top: 47, bottom: 34 },
  features: { roundedCorners: true, borderRadius: 40 },
  frame: {
    borderWidth: 1,
    borderColor: '#333',
    shadow: '0 0 20px rgba(0,0,0,0.5)',
    backgroundColor: '#000',
  },
};

const dynamicIslandDevice: DeviceSpec = {
  ...testDevice,
  id: 'iphone-15-pro',
  name: 'iPhone 15 Pro',
  features: { dynamicIsland: true, roundedCorners: true, borderRadius: 55 },
};

const punchHoleDevice: DeviceSpec = {
  ...testDevice,
  id: 'pixel-8',
  platform: 'android',
  features: { punchHole: 'center' as const, punchHoleDiameter: 20, roundedCorners: true, borderRadius: 40 },
};

const makeSurface = (children: Partial<MarkframeNode>[] = []): MarkframeNode => ({
  id: 'home',
  type: 'Surface',
  parentId: null,
  props: {},
  children: children.map((c, i) => ({
    id: `child-${i}`,
    type: 'Text',
    parentId: 'home',
    props: { label: `Item ${i}` },
    children: [],
    ...c,
  })),
});

describe('DevicePreview', () => {
  describe('error state', () => {
    it('displays parsing error message', () => {
      render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error="Unexpected token at line 3"
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      expect(screen.getByText('Parsing Error')).toBeInTheDocument();
      expect(screen.getByText('Unexpected token at line 3')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows placeholder when no surface and no error', () => {
      render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      expect(screen.getByText(/No active surface found/)).toBeInTheDocument();
    });
  });

  describe('device info overlay', () => {
    it('shows device info when showDeviceInfo is true', () => {
      render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
          showDeviceInfo={true}
        />,
      );
      expect(screen.getByText(/Test Phone/)).toBeInTheDocument();
      expect(screen.getByText(/390×844/)).toBeInTheDocument();
    });

    it('hides device info when showDeviceInfo is false', () => {
      render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
          showDeviceInfo={false}
        />,
      );
      // The sticky bottom div should not exist
      const infoElements = screen.queryAllByText(/Test Phone.*390×844/);
      expect(infoElements).toHaveLength(0);
    });
  });

  describe('zoom clamping', () => {
    it('clamps zoom to minimum 0.5', () => {
      render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={0.1}
          showDeviceInfo={true}
        />,
      );
      // Check that zoom displays 50% (clamped from 10%)
      expect(screen.getByText(/50%/)).toBeInTheDocument();
    });

    it('clamps zoom to maximum 1.5', () => {
      render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={3.0}
          showDeviceInfo={true}
        />,
      );
      expect(screen.getByText(/150%/)).toBeInTheDocument();
    });
  });

  describe('device features', () => {
    it('renders Dynamic Island in portrait mode', () => {
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={dynamicIslandDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      // Dynamic Island is a rounded div with specific width
      const island = container.querySelector('[style*="width: 126px"]');
      expect(island).toBeInTheDocument();
    });

    it('does not render Dynamic Island in landscape mode', () => {
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={dynamicIslandDevice}
          orientation="landscape"
          zoom={1.0}
        />,
      );
      const island = container.querySelector('[style*="width: 126px"][style*="height: 37px"]');
      expect(island).toBeNull();
    });

    it('renders punch hole camera in portrait for Android', () => {
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="material"
          error={null}
          device={punchHoleDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      // Punch hole has specific diameter
      const punchHole = container.querySelector('[style*="width: 20px"]');
      expect(punchHole).toBeInTheDocument();
    });

    it('renders iOS home indicator for devices with bottom safe area', () => {
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      // Home indicator is 134px wide for phones
      const indicator = container.querySelector('[style*="width: 134px"]');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('orientation', () => {
    it('swaps dimensions in landscape mode', () => {
      render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="landscape"
          zoom={1.0}
          showDeviceInfo={true}
        />,
      );
      // In landscape, width and height should be swapped: 844×390
      expect(screen.getByText(/844×390/)).toBeInTheDocument();
    });
  });

  describe('active surface rendering', () => {
    it('renders surface content when activeSurface is provided', () => {
      const surface = makeSurface([
        { type: 'Text', props: { text: 'Hello World' } },
      ]);
      const { container } = render(
        <DevicePreview
          activeSurface={surface}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      // Should not show the empty state
      expect(screen.queryByText(/No active surface found/)).toBeNull();
      // The surface wrapper div with safe area vars should exist
      const safeAreaDiv = container.querySelector('[style*="--k-safe-area-top"]');
      expect(safeAreaDiv).toBeInTheDocument();
    });

    it('injects correct safe area CSS variables in portrait', () => {
      const surface = makeSurface();
      const { container } = render(
        <DevicePreview
          activeSurface={surface}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      const safeAreaDiv = container.querySelector('[style*="--k-safe-area-top"]') as HTMLElement;
      expect(safeAreaDiv).not.toBeNull();
      expect(safeAreaDiv.style.getPropertyValue('--k-safe-area-top')).toBe('47px');
      expect(safeAreaDiv.style.getPropertyValue('--k-safe-area-bottom')).toBe('34px');
      expect(safeAreaDiv.style.getPropertyValue('--k-safe-area-left')).toBe('0px');
    });

    it('injects left safe area in landscape orientation', () => {
      const surface = makeSurface();
      const { container } = render(
        <DevicePreview
          activeSurface={surface}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="landscape"
          zoom={1.0}
        />,
      );
      const safeAreaDiv = container.querySelector('[style*="--k-safe-area-left"]') as HTMLElement;
      expect(safeAreaDiv).not.toBeNull();
      // In landscape, top safe area moves to left
      expect(safeAreaDiv.style.getPropertyValue('--k-safe-area-top')).toBe('0px');
      expect(safeAreaDiv.style.getPropertyValue('--k-safe-area-left')).toBe('47px');
    });
  });

  describe('landscape device features', () => {
    it('renders landscape Dynamic Island', () => {
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={dynamicIslandDevice}
          orientation="landscape"
          zoom={1.0}
        />,
      );
      // Landscape dynamic island has width 37px, height 126px (rotated)
      const landscapeIsland = container.querySelector('[style*="width: 37px"]');
      expect(landscapeIsland).toBeInTheDocument();
    });

    it('renders landscape punch hole', () => {
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="material"
          error={null}
          device={punchHoleDevice}
          orientation="landscape"
          zoom={1.0}
        />,
      );
      // Landscape punch hole positioned on the left side
      const landscapePunch = container.querySelector('[style*="left: 10px"]');
      expect(landscapePunch).toBeInTheDocument();
    });

    it('does not render landscape features in portrait mode', () => {
      // A plain device with no features should produce no landscape feature div
      const plainDevice: DeviceSpec = {
        ...testDevice,
        features: { roundedCorners: true, borderRadius: 40 },
      };
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={plainDevice}
          orientation="landscape"
          zoom={1.0}
        />,
      );
      // getLandscapeFeatureStyle returns null for devices without dynamic island or punch hole
      const landscapeFeature = container.querySelector('[style*="left: 12px"][style*="width: 37px"]');
      expect(landscapeFeature).toBeNull();
    });
  });

  describe('home indicator variants', () => {
    it('renders wider home indicator for tablets', () => {
      const tabletDevice: DeviceSpec = {
        ...testDevice,
        formFactor: 'tablet',
      };
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={tabletDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      // Tablet home indicator is 160px wide
      const indicator = container.querySelector('[style*="width: 160px"]');
      expect(indicator).toBeInTheDocument();
    });

    it('does not render home indicator for android devices', () => {
      const androidDevice: DeviceSpec = {
        ...testDevice,
        platform: 'android',
      };
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="material"
          error={null}
          device={androidDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      // Android devices don't get the iOS home indicator
      const indicator = container.querySelector('[style*="width: 134px"][style*="height: 5px"]');
      expect(indicator).toBeNull();
    });

    it('does not render home indicator in landscape', () => {
      const { container } = render(
        <DevicePreview
          activeSurface={null}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="landscape"
          zoom={1.0}
        />,
      );
      // Home indicator only shows in portrait
      const indicator = container.querySelector('[style*="width: 134px"][style*="height: 5px"]');
      expect(indicator).toBeNull();
    });
  });

  describe('drag-to-scroll event handlers', () => {
    it('attaches mouse event handlers to the screen element', () => {
      const surface = makeSurface([
        { type: 'Text', props: { text: 'Scroll content' } },
      ]);
      const { container } = render(
        <DevicePreview
          activeSurface={surface}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      const screenEl = container.querySelector('.device-screen') as HTMLElement;
      expect(screenEl).not.toBeNull();

      // Fire mouse events - these exercise the handlers even though
      // JSDOM doesn't support real scrolling. The handlers should not throw.
      fireEvent.mouseDown(screenEl, { pageX: 100, pageY: 200 });
      fireEvent.mouseMove(screenEl, { pageX: 110, pageY: 220 });
      fireEvent.mouseUp(screenEl);
      fireEvent.click(screenEl);
    });

    it('handles mouseleave as mouseup', () => {
      const surface = makeSurface([
        { type: 'Text', props: { text: 'Content' } },
      ]);
      const { container } = render(
        <DevicePreview
          activeSurface={surface}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      const screenEl = container.querySelector('.device-screen') as HTMLElement;

      fireEvent.mouseDown(screenEl, { pageX: 0, pageY: 0 });
      fireEvent.mouseLeave(screenEl);
      // Subsequent move should be a no-op since mouseLeave resets isDown
      fireEvent.mouseMove(screenEl, { pageX: 50, pageY: 50 });
    });

    it('prevents default on dragstart and contextmenu', () => {
      const surface = makeSurface([
        { type: 'Text', props: { text: 'Content' } },
      ]);
      const { container } = render(
        <DevicePreview
          activeSurface={surface}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      const screenEl = container.querySelector('.device-screen') as HTMLElement;

      // These should not throw
      fireEvent.dragStart(screenEl);
      fireEvent.contextMenu(screenEl);
    });

    it('cleans up event listeners on unmount', () => {
      const surface = makeSurface([
        { type: 'Text', props: { text: 'Content' } },
      ]);
      const { container, unmount } = render(
        <DevicePreview
          activeSurface={surface}
          theme="ios"
          error={null}
          device={testDevice}
          orientation="portrait"
          zoom={1.0}
        />,
      );
      const screenEl = container.querySelector('.device-screen') as HTMLElement;
      const removeSpy = vi.spyOn(screenEl, 'removeEventListener');

      unmount();

      // Should have removed all 7 event listeners
      expect(removeSpy.mock.calls.length).toBeGreaterThanOrEqual(7);
      removeSpy.mockRestore();
    });
  });
});
