export interface Shortcut {
  key: string;
  modifiers: ('cmd' | 'shift' | 'alt')[];
  description: string;
  category: 'General' | 'View' | 'Navigation' | 'Editing';
}

export const KEYBOARD_SHORTCUTS: Shortcut[] = [
  // General
  {
    key: 'O',
    modifiers: ['cmd'],
    description: 'Open project',
    category: 'General',
  },
  {
    key: 'S',
    modifiers: ['cmd'],
    description: 'Save project',
    category: 'General',
  },
  {
    key: '?',
    modifiers: ['cmd'],
    description: 'Show keyboard shortcuts',
    category: 'General',
  },

  // View
  {
    key: 'R',
    modifiers: ['cmd'],
    description: 'Toggle portrait/landscape',
    category: 'View',
  },
  {
    key: '+',
    modifiers: ['cmd'],
    description: 'Zoom in',
    category: 'View',
  },
  {
    key: '-',
    modifiers: ['cmd'],
    description: 'Zoom out',
    category: 'View',
  },
  {
    key: '0',
    modifiers: ['cmd'],
    description: 'Reset zoom to 100%',
    category: 'View',
  },
  {
    key: 'I',
    modifiers: ['cmd'],
    description: 'Toggle device info overlay',
    category: 'View',
  },

  // Navigation
  {
    key: '1-9',
    modifiers: ['cmd'],
    description: 'Select device by number',
    category: 'Navigation',
  },
  {
    key: ']',
    modifiers: ['cmd'],
    description: 'Next device',
    category: 'Navigation',
  },
  {
    key: '[',
    modifiers: ['cmd'],
    description: 'Previous device',
    category: 'Navigation',
  },
  {
    key: ']',
    modifiers: ['cmd', 'shift'],
    description: 'Next blueprint',
    category: 'Navigation',
  },
  {
    key: '[',
    modifiers: ['cmd', 'shift'],
    description: 'Previous blueprint',
    category: 'Navigation',
  },

  // Editing
  {
    key: 'E',
    modifiers: ['cmd'],
    description: 'Focus editor',
    category: 'Editing',
  },
];

const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export function formatShortcut(shortcut: Shortcut): string {
  const modifiers = shortcut.modifiers.map(mod => {
    if (mod === 'cmd') return isMac ? '\u2318' : 'Ctrl';
    if (mod === 'shift') return isMac ? '\u21E7' : 'Shift';
    if (mod === 'alt') return isMac ? '\u2325' : 'Alt';
    return mod;
  });
  return [...modifiers, shortcut.key].join(isMac ? '' : '+');
}

export function formatShortcutHint(keys: string): string {
  if (isMac) {
    return keys.replace(/Cmd/g, '\u2318').replace(/Shift/g, '\u21E7').replace(/Alt/g, '\u2325');
  }
  return keys.replace(/Cmd/g, 'Ctrl');
}
