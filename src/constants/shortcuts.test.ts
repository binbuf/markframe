import { KEYBOARD_SHORTCUTS, formatShortcut, formatShortcutHint, type Shortcut } from './shortcuts';

// ===========================================================================
// KEYBOARD_SHORTCUTS constant
// ===========================================================================
describe('KEYBOARD_SHORTCUTS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(KEYBOARD_SHORTCUTS)).toBe(true);
    expect(KEYBOARD_SHORTCUTS.length).toBeGreaterThan(0);
  });

  it('each shortcut has required properties', () => {
    for (const s of KEYBOARD_SHORTCUTS) {
      expect(s).toHaveProperty('key');
      expect(s).toHaveProperty('modifiers');
      expect(s).toHaveProperty('description');
      expect(s).toHaveProperty('category');
      expect(typeof s.key).toBe('string');
      expect(Array.isArray(s.modifiers)).toBe(true);
      expect(typeof s.description).toBe('string');
    }
  });

  it('categories are valid', () => {
    const validCategories = ['General', 'View', 'Navigation', 'Editing'];
    for (const s of KEYBOARD_SHORTCUTS) {
      expect(validCategories).toContain(s.category);
    }
  });

  it('modifiers are valid', () => {
    const validModifiers = ['cmd', 'shift', 'alt'];
    for (const s of KEYBOARD_SHORTCUTS) {
      for (const mod of s.modifiers) {
        expect(validModifiers).toContain(mod);
      }
    }
  });

  it('contains essential shortcuts (Open, Save)', () => {
    const open = KEYBOARD_SHORTCUTS.find(s => s.key === 'O' && s.modifiers.includes('cmd'));
    const save = KEYBOARD_SHORTCUTS.find(s => s.key === 'S' && s.modifiers.includes('cmd'));
    expect(open).toBeDefined();
    expect(save).toBeDefined();
  });
});

// ===========================================================================
// formatShortcut
// ===========================================================================
describe('formatShortcut', () => {
  it('formats a simple cmd shortcut', () => {
    const shortcut: Shortcut = { key: 'S', modifiers: ['cmd'], description: 'Save', category: 'General' };
    const result = formatShortcut(shortcut);
    // On non-Mac (test env), should be Ctrl+S
    expect(result).toMatch(/Ctrl\+S|⌘S/);
  });

  it('formats a shortcut with multiple modifiers', () => {
    const shortcut: Shortcut = { key: ']', modifiers: ['cmd', 'shift'], description: 'Next', category: 'Navigation' };
    const result = formatShortcut(shortcut);
    expect(result).toContain(']');
    // Should contain both modifier representations
    expect(result.length).toBeGreaterThan(1);
  });

  it('formats a shortcut with no modifiers', () => {
    const shortcut: Shortcut = { key: 'F1', modifiers: [], description: 'Help', category: 'General' };
    const result = formatShortcut(shortcut);
    expect(result).toBe('F1');
  });
});

// ===========================================================================
// formatShortcutHint
// ===========================================================================
describe('formatShortcutHint', () => {
  it('replaces Cmd with Ctrl on non-Mac', () => {
    // In test environment (jsdom), navigator.platform is typically not Mac
    const result = formatShortcutHint('Cmd+S');
    expect(result).toBe('Ctrl+S');
  });

  it('replaces multiple Cmd occurrences', () => {
    const result = formatShortcutHint('Cmd+Shift+Cmd+S');
    expect(result).toBe('Ctrl+Shift+Ctrl+S');
  });

  it('passes through text without Cmd/Shift/Alt unchanged', () => {
    const result = formatShortcutHint('F1');
    expect(result).toBe('F1');
  });
});
