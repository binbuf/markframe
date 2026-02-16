import { badgeColorMap, OVERLAY_TYPES } from './shared';

// ===========================================================================
// badgeColorMap
// ===========================================================================
describe('badgeColorMap', () => {
  it('contains expected color keys', () => {
    const expectedKeys = ['primary', 'success', 'danger', 'warning', 'gray'];
    for (const key of expectedKeys) {
      expect(badgeColorMap).toHaveProperty(key);
    }
  });

  it('each entry has bg and text properties', () => {
    for (const [_key, value] of Object.entries(badgeColorMap)) {
      expect(value).toHaveProperty('bg');
      expect(value).toHaveProperty('text');
      expect(typeof value.bg).toBe('string');
      expect(typeof value.text).toBe('string');
    }
  });

  it('text colors are non-empty strings', () => {
    for (const value of Object.values(badgeColorMap)) {
      expect(value.text.length).toBeGreaterThan(0);
      expect(value.bg.length).toBeGreaterThan(0);
    }
  });
});

// ===========================================================================
// OVERLAY_TYPES
// ===========================================================================
describe('OVERLAY_TYPES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(OVERLAY_TYPES)).toBe(true);
    expect(OVERLAY_TYPES.length).toBeGreaterThan(0);
  });

  it('contains expected overlay types', () => {
    const expected = ['Sheet', 'Popup', 'Dialog', 'Actions', 'Toast'];
    for (const type of expected) {
      expect(OVERLAY_TYPES).toContain(type);
    }
  });

  it('all entries are PascalCase strings', () => {
    for (const type of OVERLAY_TYPES) {
      expect(typeof type).toBe('string');
      expect(type[0]).toBe(type[0].toUpperCase());
    }
  });

  it('contains Popover and Panel', () => {
    expect(OVERLAY_TYPES).toContain('Popover');
    expect(OVERLAY_TYPES).toContain('Panel');
  });
});
