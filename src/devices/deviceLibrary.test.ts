import { devices, getDeviceById, DEFAULT_DEVICE, iPhone15Pro } from './deviceLibrary';
import type { DeviceSpec } from '../types/device';

// ===========================================================================
// 1. Device Library Data Integrity
// ===========================================================================

describe('Device Library Data Integrity', () => {
  it('contains all expected devices', () => {
    expect(devices.length).toBeGreaterThanOrEqual(12);
  });

  describe.each(devices.map(d => [d.id, d] as const))('%s', (_id, device) => {
    it('has all required properties', () => {
      expect(device.id).toBeTruthy();
      expect(device.name).toBeTruthy();
      expect(device.platform).toBeTruthy();
      expect(device.formFactor).toBeTruthy();
      expect(device.dimensions).toBeDefined();
      expect(device.safeArea).toBeDefined();
      expect(device.features).toBeDefined();
      expect(device.frame).toBeDefined();
    });

    it('has positive screen dimensions with width < height (portrait)', () => {
      const { width, height, scale } = device.dimensions;
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
      expect(scale).toBeGreaterThan(0);
      expect(width).toBeLessThan(height);
    });

    it('has valid platform value', () => {
      expect(['ios', 'android']).toContain(device.platform);
    });

    it('has valid form factor', () => {
      expect(['phone', 'tablet']).toContain(device.formFactor);
    });

    it('has non-negative safe area insets', () => {
      expect(device.safeArea.top).toBeGreaterThanOrEqual(0);
      expect(device.safeArea.bottom).toBeGreaterThanOrEqual(0);
      if (device.safeArea.left !== undefined) {
        expect(device.safeArea.left).toBeGreaterThanOrEqual(0);
      }
      if (device.safeArea.right !== undefined) {
        expect(device.safeArea.right).toBeGreaterThanOrEqual(0);
      }
    });

    it('has valid frame properties', () => {
      expect(device.frame.borderWidth).toBeGreaterThanOrEqual(0);
      expect(device.frame.borderColor).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      expect(device.frame.shadow).toBeTruthy();
      expect(device.frame.backgroundColor).toMatch(/^#[0-9a-fA-F]{3,8}$/);
    });

    it('has reasonable dimensions for its form factor', () => {
      const { width, height } = device.dimensions;
      if (device.formFactor === 'phone') {
        expect(width).toBeGreaterThanOrEqual(320);
        expect(width).toBeLessThanOrEqual(500);
        expect(height).toBeGreaterThanOrEqual(600);
        expect(height).toBeLessThanOrEqual(1100);
      } else {
        // tablet
        expect(width).toBeGreaterThanOrEqual(700);
        expect(height).toBeGreaterThanOrEqual(800);
      }
    });
  });
});

// ===========================================================================
// 2. Unique Identifiers
// ===========================================================================

describe('Unique Identifiers', () => {
  it('all device IDs are unique', () => {
    const ids = devices.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all device names are unique', () => {
    const names = devices.map(d => d.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

// ===========================================================================
// 3. Platform & Form Factor Distribution
// ===========================================================================

describe('Platform & Form Factor Distribution', () => {
  it('contains iOS devices', () => {
    const ios = devices.filter(d => d.platform === 'ios');
    expect(ios.length).toBeGreaterThan(0);
  });

  it('contains Android devices', () => {
    const android = devices.filter(d => d.platform === 'android');
    expect(android.length).toBeGreaterThan(0);
  });

  it('contains phones', () => {
    const phones = devices.filter(d => d.formFactor === 'phone');
    expect(phones.length).toBeGreaterThan(0);
  });

  it('contains tablets', () => {
    const tablets = devices.filter(d => d.formFactor === 'tablet');
    expect(tablets.length).toBeGreaterThan(0);
  });

  it('contains both iOS and Android tablets', () => {
    const iosTablets = devices.filter(d => d.platform === 'ios' && d.formFactor === 'tablet');
    const androidTablets = devices.filter(d => d.platform === 'android' && d.formFactor === 'tablet');
    expect(iosTablets.length).toBeGreaterThan(0);
    expect(androidTablets.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// 4. Device Feature Correctness
// ===========================================================================

describe('Device Feature Correctness', () => {
  it('iOS phones with Dynamic Island have expected safe area', () => {
    const dynamicIslandDevices = devices.filter(
      d => d.platform === 'ios' && d.features.dynamicIsland
    );
    expect(dynamicIslandDevices.length).toBeGreaterThan(0);

    for (const device of dynamicIslandDevices) {
      // Dynamic Island devices have larger top safe area
      expect(device.safeArea.top).toBeGreaterThanOrEqual(50);
    }
  });

  it('Android phones with punch-hole have valid position', () => {
    const punchHoleDevices = devices.filter(d => d.features.punchHole);
    expect(punchHoleDevices.length).toBeGreaterThan(0);

    for (const device of punchHoleDevices) {
      expect(['center', 'left', 'right']).toContain(device.features.punchHole);
    }
  });

  it('devices with punch-hole have a diameter', () => {
    const punchHoleDevices = devices.filter(d => d.features.punchHole);
    for (const device of punchHoleDevices) {
      expect(device.features.punchHoleDiameter).toBeGreaterThan(0);
    }
  });

  it('tablets do not have Dynamic Island or punch-hole', () => {
    const tablets = devices.filter(d => d.formFactor === 'tablet');
    for (const tablet of tablets) {
      expect(tablet.features.dynamicIsland).toBeFalsy();
      expect(tablet.features.punchHole).toBeFalsy();
    }
  });

  it('devices with rounded corners have a borderRadius', () => {
    const rounded = devices.filter(d => d.features.roundedCorners);
    expect(rounded.length).toBe(devices.length); // all devices should have rounded corners
    for (const device of rounded) {
      expect(device.features.borderRadius).toBeGreaterThan(0);
    }
  });
});

// ===========================================================================
// 5. getDeviceById
// ===========================================================================

describe('getDeviceById', () => {
  it('finds each device by its ID', () => {
    for (const device of devices) {
      const found = getDeviceById(device.id);
      expect(found).toBe(device);
    }
  });

  it('returns undefined for unknown ID', () => {
    expect(getDeviceById('nonexistent-device')).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(getDeviceById('')).toBeUndefined();
  });
});

// ===========================================================================
// 6. Default Device
// ===========================================================================

describe('DEFAULT_DEVICE', () => {
  it('is iPhone 15 Pro', () => {
    expect(DEFAULT_DEVICE).toBe(iPhone15Pro);
    expect(DEFAULT_DEVICE.id).toBe('iphone-15-pro');
  });

  it('is included in the devices array', () => {
    expect(devices).toContain(DEFAULT_DEVICE);
  });
});
