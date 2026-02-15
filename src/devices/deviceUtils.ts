import type { DeviceSpec, DeviceOrientation } from '../types/device';

/**
 * Get device dimensions accounting for orientation
 */
export function getOrientedDimensions(
  device: DeviceSpec,
  orientation: DeviceOrientation
) {
  const { width, height } = device.dimensions;

  if (orientation === 'landscape') {
    return {
      width: height,
      height: width,
    };
  }

  return { width, height };
}

/**
 * Get safe area insets accounting for orientation
 */
export function getOrientedSafeArea(
  device: DeviceSpec,
  orientation: DeviceOrientation
) {
  const { top, bottom, left = 0, right = 0 } = device.safeArea;

  if (orientation === 'landscape') {
    return {
      top: left,
      right: top,
      bottom: right,
      left: bottom,
    };
  }

  return { top, right, bottom, left };
}

/**
 * Format device name for display
 */
export function formatDeviceName(device: DeviceSpec, includeFormFactor = false): string {
  const name = device.shortName || device.name;

  if (includeFormFactor) {
    const ff = device.formFactor === 'tablet' ? ' (Tablet)' : '';
    return `${name}${ff}`;
  }

  return name;
}

/**
 * Get scale factor for fitting device in container
 */
export function getScaleFactor(
  device: DeviceSpec,
  containerWidth: number,
  containerHeight: number,
  orientation: DeviceOrientation
): number {
  const { width, height } = getOrientedDimensions(device, orientation);
  // With content-box sizing, border is drawn outside the width/height
  const totalWidth = width + 2 * device.frame.borderWidth;
  const totalHeight = height + 2 * device.frame.borderWidth;

  // 80px padding accounts for toolbar height, margins, and visual breathing room
  const padding = 80;
  const scaleX = (containerWidth - padding) / totalWidth;
  const scaleY = (containerHeight - padding) / totalHeight;

  return Math.min(scaleX, scaleY, 1); // Never scale up beyond 100%
}

/**
 * Get dynamic island / punch-hole style for landscape orientation
 */
export function getLandscapeFeatureStyle(
  device: DeviceSpec,
  orientation: DeviceOrientation
) {
  if (orientation === 'portrait') return null;

  if (device.features.dynamicIsland) {
    return {
      position: 'absolute' as const,
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '37px',
      height: '126px',
      backgroundColor: '#000',
      borderRadius: '18.5px',
      zIndex: 50,
      pointerEvents: 'none' as const,
    };
  }

  if (device.features.punchHole) {
    const diameter = device.features.punchHoleDiameter ?? 20;
    return {
      position: 'absolute' as const,
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: `${diameter}px`,
      height: `${diameter}px`,
      backgroundColor: '#000',
      borderRadius: '50%',
      zIndex: 50,
      pointerEvents: 'none' as const,
    };
  }

  return null;
}
