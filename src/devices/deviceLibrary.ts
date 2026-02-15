import type { DeviceSpec } from '../types/device';

/**
 * markframe Device Library
 *
 * Accurate device specifications for iOS and Android devices.
 * Dimensions are in CSS pixels (logical pixels, not physical).
 *
 * Sources:
 * - iOS: https://developer.apple.com/design/human-interface-guidelines/layout
 * - Android: https://developer.android.com/guide/topics/large-screens/support-different-screen-sizes
 */

// ============================================================================
// iOS Devices
// ============================================================================

export const iPhone15Pro: DeviceSpec = {
  id: 'iphone-15-pro',
  name: 'iPhone 15 Pro',
  shortName: 'iPhone 15 Pro',
  platform: 'ios',
  formFactor: 'phone',
  dimensions: {
    width: 393,
    height: 852,
    scale: 3,
    aspectRatio: '393:852',
  },
  safeArea: {
    top: 59, // Status bar + Dynamic Island
    bottom: 20, // Home indicator (reduced; Konsta adds +16px via pb-safe-4)
  },
  features: {
    dynamicIsland: true,
    roundedCorners: true,
    borderRadius: 55,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#374151',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#1f2937',
  },
};

export const iPhone15ProMax: DeviceSpec = {
  id: 'iphone-15-pro-max',
  name: 'iPhone 15 Pro Max',
  shortName: 'iPhone 15 Pro Max',
  platform: 'ios',
  formFactor: 'phone',
  dimensions: {
    width: 430,
    height: 932,
    scale: 3,
    aspectRatio: '430:932',
  },
  safeArea: {
    top: 59,
    bottom: 20,
  },
  features: {
    dynamicIsland: true,
    roundedCorners: true,
    borderRadius: 55,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#374151',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#1f2937',
  },
};

export const iPadMini: DeviceSpec = {
  id: 'ipad-mini',
  name: 'iPad mini (6th gen)',
  shortName: 'iPad mini',
  platform: 'ios',
  formFactor: 'tablet',
  dimensions: {
    width: 744,
    height: 1133,
    scale: 2,
    aspectRatio: '744:1133',
  },
  safeArea: {
    top: 24, // Status bar
    bottom: 10, // Home indicator (reduced; Konsta adds +16px via pb-safe-4)
  },
  features: {
    roundedCorners: true,
    borderRadius: 18,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#000000',
  },
};

export const iPadPro11: DeviceSpec = {
  id: 'ipad-pro-11',
  name: 'iPad Pro 11"',
  shortName: 'iPad Pro 11"',
  platform: 'ios',
  formFactor: 'tablet',
  dimensions: {
    width: 834,
    height: 1194,
    scale: 2,
    aspectRatio: '834:1194',
  },
  safeArea: {
    top: 24,
    bottom: 10,
  },
  features: {
    roundedCorners: true,
    borderRadius: 18,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#000000',
  },
};

export const iPadPro129: DeviceSpec = {
  id: 'ipad-pro-129',
  name: 'iPad Pro 12.9"',
  shortName: 'iPad Pro 12.9"',
  platform: 'ios',
  formFactor: 'tablet',
  dimensions: {
    width: 1024,
    height: 1366,
    scale: 2,
    aspectRatio: '1024:1366',
  },
  safeArea: {
    top: 24,
    bottom: 10,
  },
  features: {
    roundedCorners: true,
    borderRadius: 18,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#000000',
  },
};

// ============================================================================
// Android Devices
// ============================================================================

export const pixel7: DeviceSpec = {
  id: 'pixel-7',
  name: 'Google Pixel 7',
  shortName: 'Pixel 7',
  platform: 'android',
  formFactor: 'phone',
  dimensions: {
    width: 412,
    height: 915,
    scale: 2.625,
    aspectRatio: '412:915',
  },
  safeArea: {
    top: 24, // Status bar
    bottom: 0, // Gesture navigation (no bar)
  },
  features: {
    punchHole: 'center',
    punchHoleDiameter: 20,
    roundedCorners: true,
    borderRadius: 42,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#1c1c1e',
  },
};

export const galaxyS23: DeviceSpec = {
  id: 'galaxy-s23',
  name: 'Samsung Galaxy S23',
  shortName: 'Galaxy S23',
  platform: 'android',
  formFactor: 'phone',
  dimensions: {
    width: 360,
    height: 780,
    scale: 3,
    aspectRatio: '360:780',
  },
  safeArea: {
    top: 24,
    bottom: 0,
  },
  features: {
    punchHole: 'center',
    punchHoleDiameter: 20,
    roundedCorners: true,
    borderRadius: 42,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#000000',
  },
};

export const onePlus11: DeviceSpec = {
  id: 'oneplus-11',
  name: 'OnePlus 11',
  shortName: 'OnePlus 11',
  platform: 'android',
  formFactor: 'phone',
  dimensions: {
    width: 412,
    height: 919,
    scale: 3.5,
    aspectRatio: '412:919',
  },
  safeArea: {
    top: 24,
    bottom: 0,
  },
  features: {
    punchHole: 'left',
    punchHoleDiameter: 22,
    roundedCorners: true,
    borderRadius: 45,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#0f172a',
  },
};

export const pixelTablet: DeviceSpec = {
  id: 'pixel-tablet',
  name: 'Google Pixel Tablet',
  shortName: 'Pixel Tablet',
  platform: 'android',
  formFactor: 'tablet',
  dimensions: {
    width: 800,
    height: 1280,
    scale: 2,
    aspectRatio: '10:16',
  },
  safeArea: {
    top: 24,
    bottom: 0,
  },
  features: {
    roundedCorners: true,
    borderRadius: 12,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#374151',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#1f2937',
  },
};

export const galaxyTabS9: DeviceSpec = {
  id: 'galaxy-tab-s9',
  name: 'Samsung Galaxy Tab S9',
  shortName: 'Galaxy Tab S9',
  platform: 'android',
  formFactor: 'tablet',
  dimensions: {
    width: 1024,
    height: 1366,
    scale: 2.5,
    aspectRatio: '3:4',
  },
  safeArea: {
    top: 24,
    bottom: 0,
  },
  features: {
    roundedCorners: true,
    borderRadius: 12,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#000000',
  },
};

export const iPhone16Pro: DeviceSpec = {
  id: 'iphone-16-pro',
  name: 'iPhone 16 Pro',
  shortName: 'iPhone 16 Pro',
  platform: 'ios',
  formFactor: 'phone',
  dimensions: {
    width: 402,
    height: 874,
    scale: 3,
    aspectRatio: '402:874',
  },
  safeArea: {
    top: 59,
    bottom: 20,
  },
  features: {
    dynamicIsland: true,
    roundedCorners: true,
    borderRadius: 55,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#374151',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#1f2937',
  },
};

export const iPhone16ProMax: DeviceSpec = {
  id: 'iphone-16-pro-max',
  name: 'iPhone 16 Pro Max',
  shortName: 'iPhone 16 Pro Max',
  platform: 'ios',
  formFactor: 'phone',
  dimensions: {
    width: 440,
    height: 956,
    scale: 3,
    aspectRatio: '440:956',
  },
  safeArea: {
    top: 59,
    bottom: 20,
  },
  features: {
    dynamicIsland: true,
    roundedCorners: true,
    borderRadius: 55,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#374151',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#1f2937',
  },
};

export const pixel9: DeviceSpec = {
  id: 'pixel-9',
  name: 'Google Pixel 9',
  shortName: 'Pixel 9',
  platform: 'android',
  formFactor: 'phone',
  dimensions: {
    width: 412,
    height: 923,
    scale: 2.75,
    aspectRatio: '412:923',
  },
  safeArea: {
    top: 24,
    bottom: 0,
  },
  features: {
    punchHole: 'center',
    punchHoleDiameter: 20,
    roundedCorners: true,
    borderRadius: 42,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#1c1c1e',
  },
};

export const pixel9ProXL: DeviceSpec = {
  id: 'pixel-9-pro-xl',
  name: 'Google Pixel 9 Pro XL',
  shortName: 'Pixel 9 Pro XL',
  platform: 'android',
  formFactor: 'phone',
  dimensions: {
    width: 448,
    height: 998,
    scale: 3,
    aspectRatio: '448:998',
  },
  safeArea: {
    top: 24,
    bottom: 0,
  },
  features: {
    punchHole: 'center',
    punchHoleDiameter: 20,
    roundedCorners: true,
    borderRadius: 42,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#1c1c1e',
  },
};

export const galaxyS24Ultra: DeviceSpec = {
  id: 'galaxy-s24-ultra',
  name: 'Samsung Galaxy S24 Ultra',
  shortName: 'Galaxy S24 Ultra',
  platform: 'android',
  formFactor: 'phone',
  dimensions: {
    width: 412,
    height: 915,
    scale: 3.5,
    aspectRatio: '412:915',
  },
  safeArea: {
    top: 24,
    bottom: 0,
  },
  features: {
    punchHole: 'center',
    punchHoleDiameter: 18,
    roundedCorners: true,
    borderRadius: 42,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#000000',
  },
};

export const galaxyS25Ultra: DeviceSpec = {
  id: 'galaxy-s25-ultra',
  name: 'Samsung Galaxy S25 Ultra',
  shortName: 'Galaxy S25 Ultra',
  platform: 'android',
  formFactor: 'phone',
  dimensions: {
    width: 412,
    height: 915,
    scale: 3.5,
    aspectRatio: '412:915',
  },
  safeArea: {
    top: 24,
    bottom: 0,
  },
  features: {
    punchHole: 'center',
    punchHoleDiameter: 18,
    roundedCorners: true,
    borderRadius: 42,
  },
  frame: {
    borderWidth: 0,
    borderColor: '#1f2937',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backgroundColor: '#000000',
  },
};

// ============================================================================
// Device Registry
// ============================================================================

export const devices: DeviceSpec[] = [
  // iOS Phones
  iPhone15Pro,
  iPhone15ProMax,
  iPhone16Pro,
  iPhone16ProMax,

  // iOS Tablets
  iPadMini,
  iPadPro11,
  iPadPro129,

  // Android Phones
  pixel7,
  pixel9,
  pixel9ProXL,
  galaxyS23,
  galaxyS24Ultra,
  galaxyS25Ultra,
  onePlus11,

  // Android Tablets
  pixelTablet,
  galaxyTabS9,
];

// Helper functions
export function getDeviceById(id: string): DeviceSpec | undefined {
  return devices.find(d => d.id === id);
}

// Default device (iPhone 15 Pro - modern, common)
export const DEFAULT_DEVICE = iPhone15Pro;

