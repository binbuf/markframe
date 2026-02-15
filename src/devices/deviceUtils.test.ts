import { getOrientedDimensions, getOrientedSafeArea, formatDeviceName, getScaleFactor, getLandscapeFeatureStyle } from './deviceUtils';
import { devices } from './deviceLibrary';
import type { DeviceSpec } from '../types/device';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const testPhone: DeviceSpec = {
  id: 'test-phone',
  name: 'Test Phone',
  shortName: 'Test',
  platform: 'ios',
  formFactor: 'phone',
  dimensions: { width: 390, height: 844, scale: 3 },
  safeArea: { top: 47, bottom: 34, left: 0, right: 0 },
  features: {},
  frame: { borderWidth: 1, borderColor: '#333', shadow: 'none', backgroundColor: '#000' },
};

const testTablet: DeviceSpec = {
  id: 'test-tablet',
  name: 'Test Tablet',
  platform: 'ios',
  formFactor: 'tablet',
  dimensions: { width: 834, height: 1194, scale: 2 },
  safeArea: { top: 24, bottom: 10 },
  features: { roundedCorners: true, borderRadius: 18 },
  frame: { borderWidth: 0, borderColor: '#1f2937', shadow: '0 25px 50px rgba(0,0,0,0.5)', backgroundColor: '#000' },
};

// ===========================================================================
// 1. getOrientedDimensions
// ===========================================================================

describe('getOrientedDimensions', () => {
  it('returns portrait dimensions by default', () => {
    expect(getOrientedDimensions(testPhone, 'portrait')).toEqual({ width: 390, height: 844 });
  });

  it('swaps dimensions in landscape', () => {
    expect(getOrientedDimensions(testPhone, 'landscape')).toEqual({ width: 844, height: 390 });
  });

  it('works for tablets', () => {
    expect(getOrientedDimensions(testTablet, 'portrait')).toEqual({ width: 834, height: 1194 });
    expect(getOrientedDimensions(testTablet, 'landscape')).toEqual({ width: 1194, height: 834 });
  });

  // Data-driven: verify for all real devices
  describe.each(devices.map(d => [d.id, d] as const))('%s', (_id, device) => {
    it('portrait returns original dimensions', () => {
      const result = getOrientedDimensions(device, 'portrait');
      expect(result.width).toBe(device.dimensions.width);
      expect(result.height).toBe(device.dimensions.height);
    });

    it('landscape swaps width and height', () => {
      const result = getOrientedDimensions(device, 'landscape');
      expect(result.width).toBe(device.dimensions.height);
      expect(result.height).toBe(device.dimensions.width);
    });

    it('orientation toggle is idempotent (toggle twice = original)', () => {
      const portrait = getOrientedDimensions(device, 'portrait');
      const landscape = getOrientedDimensions(device, 'landscape');
      // Swapping landscape back gives portrait
      expect(landscape.width).toBe(portrait.height);
      expect(landscape.height).toBe(portrait.width);
    });
  });
});

// ===========================================================================
// 2. getOrientedSafeArea
// ===========================================================================

describe('getOrientedSafeArea', () => {
  it('returns portrait safe area by default', () => {
    const result = getOrientedSafeArea(testPhone, 'portrait');
    expect(result.top).toBe(47);
    expect(result.bottom).toBe(34);
    expect(result.left).toBe(0);
    expect(result.right).toBe(0);
  });

  it('rotates safe area in landscape', () => {
    const result = getOrientedSafeArea(testPhone, 'landscape');
    // Portrait top → landscape right
    expect(result.right).toBe(47);
    // Portrait bottom → landscape left
    expect(result.left).toBe(34);
    // Portrait left → landscape top
    expect(result.top).toBe(0);
    // Portrait right → landscape bottom
    expect(result.bottom).toBe(0);
  });

  it('handles device without optional left/right safe area', () => {
    const result = getOrientedSafeArea(testTablet, 'portrait');
    expect(result.top).toBe(24);
    expect(result.bottom).toBe(10);
    expect(result.left).toBe(0);
    expect(result.right).toBe(0);
  });

  it('rotates safe area for device without left/right', () => {
    const result = getOrientedSafeArea(testTablet, 'landscape');
    expect(result.right).toBe(24);  // top → right
    expect(result.left).toBe(10);   // bottom → left
    expect(result.top).toBe(0);     // left (default 0) → top
    expect(result.bottom).toBe(0);  // right (default 0) → bottom
  });

  // Data-driven: verify all real devices
  describe.each(devices.map(d => [d.id, d] as const))('%s', (_id, device) => {
    it('portrait safe area has non-negative values', () => {
      const result = getOrientedSafeArea(device, 'portrait');
      expect(result.top).toBeGreaterThanOrEqual(0);
      expect(result.bottom).toBeGreaterThanOrEqual(0);
      expect(result.left).toBeGreaterThanOrEqual(0);
      expect(result.right).toBeGreaterThanOrEqual(0);
    });

    it('landscape safe area has non-negative values', () => {
      const result = getOrientedSafeArea(device, 'landscape');
      expect(result.top).toBeGreaterThanOrEqual(0);
      expect(result.bottom).toBeGreaterThanOrEqual(0);
      expect(result.left).toBeGreaterThanOrEqual(0);
      expect(result.right).toBeGreaterThanOrEqual(0);
    });
  });
});

// ===========================================================================
// 3. formatDeviceName
// ===========================================================================

describe('formatDeviceName', () => {
  it('returns short name when available', () => {
    expect(formatDeviceName(testPhone)).toBe('Test');
  });

  it('returns full name if no short name', () => {
    const d = { ...testPhone, shortName: undefined };
    expect(formatDeviceName(d)).toBe('Test Phone');
  });

  it('appends (Tablet) for tablets when includeFormFactor is true', () => {
    expect(formatDeviceName(testTablet, true)).toBe('Test Tablet (Tablet)');
  });

  it('does not append form factor for phones', () => {
    expect(formatDeviceName(testPhone, true)).toBe('Test');
  });

  it('does not append form factor when includeFormFactor is false', () => {
    expect(formatDeviceName(testTablet, false)).toBe('Test Tablet');
  });

  // Data-driven: all devices return non-empty names
  it('returns a non-empty string for every device', () => {
    for (const device of devices) {
      const name = formatDeviceName(device);
      expect(name).toBeTruthy();
      expect(typeof name).toBe('string');
    }
  });
});

// ===========================================================================
// 4. getScaleFactor
// ===========================================================================

describe('getScaleFactor', () => {
  it('returns scale <= 1 (never scales up)', () => {
    const scale = getScaleFactor(testPhone, 400, 900, 'portrait');
    expect(scale).toBeLessThanOrEqual(1);
  });

  it('returns smaller scale for smaller container', () => {
    const large = getScaleFactor(testPhone, 800, 1200, 'portrait');
    const small = getScaleFactor(testPhone, 200, 400, 'portrait');
    expect(small).toBeLessThan(large);
  });

  it('caps at 1 even with a huge container', () => {
    const scale = getScaleFactor(testPhone, 5000, 5000, 'portrait');
    expect(scale).toBe(1);
  });

  it('returns positive scale even for small containers', () => {
    const scale = getScaleFactor(testPhone, 100, 100, 'portrait');
    expect(scale).toBeGreaterThan(0);
  });

  it('accounts for border width in calculations', () => {
    const noBorder = { ...testPhone, frame: { ...testPhone.frame, borderWidth: 0 } };
    const wideBorder = { ...testPhone, frame: { ...testPhone.frame, borderWidth: 20 } };
    const scaleNoBorder = getScaleFactor(noBorder, 500, 1000, 'portrait');
    const scaleWideBorder = getScaleFactor(wideBorder, 500, 1000, 'portrait');
    // Wider border means more total size, so scale should be smaller
    expect(scaleWideBorder).toBeLessThanOrEqual(scaleNoBorder);
  });

  it('scales differently in portrait vs landscape', () => {
    // In a wide container, landscape should fit better
    const portrait = getScaleFactor(testPhone, 1000, 500, 'portrait');
    const landscape = getScaleFactor(testPhone, 1000, 500, 'landscape');
    expect(landscape).toBeGreaterThan(portrait);
  });

  // Zoom level simulation: verify scale decreases with smaller containers
  describe('zoom level behavior', () => {
    const zoomContainers = [
      { label: '50%', width: 250, height: 500 },
      { label: '75%', width: 375, height: 750 },
      { label: '100%', width: 500, height: 1000 },
      { label: '125%', width: 625, height: 1250 },
      { label: '150%', width: 750, height: 1500 },
    ];

    it('scale increases monotonically with container size', () => {
      const scales = zoomContainers.map(c =>
        getScaleFactor(testPhone, c.width, c.height, 'portrait')
      );
      for (let i = 1; i < scales.length; i++) {
        expect(scales[i]).toBeGreaterThanOrEqual(scales[i - 1]);
      }
    });
  });

  // Data-driven: all real devices produce valid scales
  describe.each(devices.map(d => [d.id, d] as const))('%s', (_id, device) => {
    it('produces a valid scale in a typical container', () => {
      const scale = getScaleFactor(device, 600, 800, 'portrait');
      expect(scale).toBeGreaterThan(0);
      expect(scale).toBeLessThanOrEqual(1);
    });

    it('produces a valid scale in landscape', () => {
      const scale = getScaleFactor(device, 800, 600, 'landscape');
      expect(scale).toBeGreaterThan(0);
      expect(scale).toBeLessThanOrEqual(1);
    });
  });
});

// ===========================================================================
// 5. getLandscapeFeatureStyle
// ===========================================================================

describe('getLandscapeFeatureStyle', () => {
  it('returns null for portrait orientation', () => {
    expect(getLandscapeFeatureStyle(testPhone, 'portrait')).toBeNull();
  });

  it('returns null for devices without features in landscape', () => {
    expect(getLandscapeFeatureStyle(testPhone, 'landscape')).toBeNull();
  });

  it('returns absolute positioned style for dynamic island in landscape', () => {
    const d = { ...testPhone, features: { dynamicIsland: true } };
    const style = getLandscapeFeatureStyle(d, 'landscape');
    expect(style).toBeTruthy();
    expect(style?.position).toBe('absolute');
    expect(style?.zIndex).toBe(50);
    expect(style?.pointerEvents).toBe('none');
  });

  it('returns pill-shaped style for dynamic island', () => {
    const d = { ...testPhone, features: { dynamicIsland: true } };
    const style = getLandscapeFeatureStyle(d, 'landscape')!;
    // Dynamic Island is a pill shape (width < height)
    expect(parseInt(style.width)).toBeLessThan(parseInt(style.height));
  });

  it('returns circular style for punch hole in landscape', () => {
    const d = { ...testPhone, features: { punchHole: 'center' as const } };
    const style = getLandscapeFeatureStyle(d, 'landscape');
    expect(style).toBeTruthy();
    expect(style?.borderRadius).toBe('50%');
    expect(style?.position).toBe('absolute');
  });

  it('uses custom punch hole diameter', () => {
    const d = { ...testPhone, features: { punchHole: 'center' as const, punchHoleDiameter: 25 } };
    const style = getLandscapeFeatureStyle(d, 'landscape')!;
    expect(style.width).toBe('25px');
    expect(style.height).toBe('25px');
  });

  it('uses default punch hole diameter when not specified', () => {
    const d = { ...testPhone, features: { punchHole: 'left' as const } };
    const style = getLandscapeFeatureStyle(d, 'landscape')!;
    expect(style.width).toBe('20px');
    expect(style.height).toBe('20px');
  });

  it('dynamic island takes precedence over punch hole', () => {
    const d = { ...testPhone, features: { dynamicIsland: true, punchHole: 'center' as const } };
    const style = getLandscapeFeatureStyle(d, 'landscape')!;
    // Dynamic Island is a pill, not circular
    expect(style.borderRadius).not.toBe('50%');
  });

  // Data-driven: verify real devices with features
  describe('real devices with Dynamic Island', () => {
    const diDevices = devices.filter(d => d.features.dynamicIsland);

    it.each(diDevices.map(d => [d.id, d] as const))('%s returns style in landscape', (_id, device) => {
      const style = getLandscapeFeatureStyle(device, 'landscape');
      expect(style).toBeTruthy();
      expect(style?.position).toBe('absolute');
    });
  });

  describe('real devices with punch-hole', () => {
    const phDevices = devices.filter(d => d.features.punchHole);

    it.each(phDevices.map(d => [d.id, d] as const))('%s returns style in landscape', (_id, device) => {
      const style = getLandscapeFeatureStyle(device, 'landscape');
      expect(style).toBeTruthy();
      expect(style?.borderRadius).toBe('50%');
    });
  });

  describe('tablets (no features)', () => {
    const tablets = devices.filter(d => d.formFactor === 'tablet');

    it.each(tablets.map(d => [d.id, d] as const))('%s returns null in landscape', (_id, device) => {
      expect(getLandscapeFeatureStyle(device, 'landscape')).toBeNull();
    });
  });
});
