/**
 * Shared utilities and constants for catalog components
 */

/**
 * Badge color map for consistent badge styling across components
 */
export const badgeColorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary', text: 'text-white' },
  success: { bg: 'bg-green-600 dark:bg-green-500', text: 'text-white' },
  danger: { bg: 'bg-red-600 dark:bg-red-500', text: 'text-white' },
  warning: { bg: 'bg-yellow-600 dark:bg-yellow-500', text: 'text-gray-900' },
  gray: { bg: 'bg-gray-500', text: 'text-white' },
};

/**
 * List of component types that represent overlays
 */
export const OVERLAY_TYPES = ['Sheet', 'Popup', 'Dialog', 'Actions', 'Popover', 'Panel', 'Toast'];
