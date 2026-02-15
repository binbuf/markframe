export type DevicePlatform = 'ios' | 'android';
export type DeviceFormFactor = 'phone' | 'tablet';
export type DeviceOrientation = 'portrait' | 'landscape';

export interface DeviceFeatures {
  /** Has Dynamic Island (iPhone 14 Pro+) */
  dynamicIsland?: boolean;

  /** Punch-hole camera position */
  punchHole?: 'center' | 'left' | 'right';

  /** Punch-hole diameter in CSS pixels (default 20 if punchHole is set) */
  punchHoleDiameter?: number;

  /** Has rounded display corners */
  roundedCorners?: boolean;

  /** Border radius in pixels */
  borderRadius?: number;
}

export interface DeviceDimensions {
  /** Width in CSS pixels (portrait) */
  width: number;

  /** Height in CSS pixels (portrait) */
  height: number;

  /** Device pixel ratio */
  scale: number;

  /** Aspect ratio string for validation */
  aspectRatio?: string;
}

export interface DeviceSafeArea {
  /** Top safe area inset (status bar, notch, etc.) */
  top: number;

  /** Bottom safe area inset (home indicator, etc.) */
  bottom: number;

  /** Left safe area inset (rarely used) */
  left?: number;

  /** Right safe area inset (rarely used) */
  right?: number;
}

export interface DeviceSpec {
  /** Unique identifier (e.g., 'iphone-15-pro') */
  id: string;

  /** Display name */
  name: string;

  /** Short name for UI */
  shortName?: string;

  /** Platform */
  platform: DevicePlatform;

  /** Form factor */
  formFactor: DeviceFormFactor;

  /** Screen dimensions */
  dimensions: DeviceDimensions;

  /** Safe area insets */
  safeArea: DeviceSafeArea;

  /** Device-specific features */
  features: DeviceFeatures;

  /** Frame styling */
  frame: {
    /** Frame border width */
    borderWidth: number;

    /** Frame border color */
    borderColor: string;

    /** Frame shadow */
    shadow: string;

    /** Background color (for bezel) */
    backgroundColor: string;
  };
}
