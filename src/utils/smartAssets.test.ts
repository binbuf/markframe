import { resolveAvatar, resolveImage } from './smartAssets';

// ===========================================================================
// resolveAvatar
// ===========================================================================
describe('resolveAvatar', () => {
  it('returns a string path', () => {
    const result = resolveAvatar('node-1');
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^\/assets\/avatars\//);
  });

  it('is deterministic — same nodeId always yields same avatar', () => {
    const a = resolveAvatar('my-node');
    const b = resolveAvatar('my-node');
    expect(a).toBe(b);
  });

  it('different nodeIds can produce different avatars', () => {
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      results.add(resolveAvatar(`node-${i}`));
    }
    // Should pick from multiple avatars across 50 different IDs
    expect(results.size).toBeGreaterThan(1);
  });

  it('picks from male pool when gender is "male"', () => {
    for (let i = 0; i < 20; i++) {
      const avatar = resolveAvatar(`node-${i}`, 'male');
      expect(avatar).toMatch(/\/avatars\/male-\d+\.jpg$/);
    }
  });

  it('picks from female pool when gender is "female"', () => {
    for (let i = 0; i < 20; i++) {
      const avatar = resolveAvatar(`node-${i}`, 'female');
      expect(avatar).toMatch(/\/avatars\/female-\d+\.jpg$/);
    }
  });

  it('picks from all avatars when no gender specified', () => {
    const results = new Set<string>();
    for (let i = 0; i < 100; i++) {
      results.add(resolveAvatar(`node-${i}`));
    }
    const hasMale = [...results].some(r => r.includes('male-'));
    const hasFemale = [...results].some(r => r.includes('female-'));
    expect(hasMale).toBe(true);
    expect(hasFemale).toBe(true);
  });

  it('picks from all avatars when gender is undefined', () => {
    const avatar = resolveAvatar('test', undefined);
    expect(avatar).toMatch(/\/avatars\/(male|female)-\d+\.jpg$/);
  });

  it('picks from all avatars when gender is unrecognized', () => {
    const avatar = resolveAvatar('test', 'other');
    expect(avatar).toMatch(/\/avatars\/(male|female)-\d+\.jpg$/);
  });

  it('handles empty string nodeId without crashing', () => {
    expect(() => resolveAvatar('')).not.toThrow();
    expect(typeof resolveAvatar('')).toBe('string');
  });
});

// ===========================================================================
// resolveImage
// ===========================================================================
describe('resolveImage', () => {
  it('returns undefined for undefined src', () => {
    expect(resolveImage(undefined, 'node-1')).toBeUndefined();
  });

  it('returns undefined for empty string src', () => {
    expect(resolveImage('', 'node-1')).toBeUndefined();
  });

  it('resolves "food" category to a local image', () => {
    const result = resolveImage('food', 'node-1');
    expect(result).toMatch(/\/assets\/images\/food-\d+\.jpg$/);
  });

  it('resolves categories case-insensitively', () => {
    const lower = resolveImage('food', 'node-1');
    const upper = resolveImage('Food', 'node-1');
    const caps = resolveImage('FOOD', 'node-1');
    expect(lower).toBe(upper);
    expect(lower).toBe(caps);
  });

  it('resolves all known categories', () => {
    const categories = ['food', 'nature', 'city', 'tech', 'fashion', 'travel'];
    for (const cat of categories) {
      const result = resolveImage(cat, 'node-1');
      expect(result).toMatch(new RegExp(`/assets/images/${cat}-\\d+\\.jpg$`));
    }
  });

  it('is deterministic — same src + nodeId returns same image', () => {
    const a = resolveImage('nature', 'my-node');
    const b = resolveImage('nature', 'my-node');
    expect(a).toBe(b);
  });

  it('passes through URLs unchanged', () => {
    const url = 'https://example.com/photo.png';
    expect(resolveImage(url, 'node-1')).toBe(url);
  });

  it('passes through relative paths unchanged', () => {
    const path = './images/custom.jpg';
    expect(resolveImage(path, 'node-1')).toBe(path);
  });

  it('passes through unknown keywords unchanged', () => {
    expect(resolveImage('unknown-category', 'node-1')).toBe('unknown-category');
  });

  it('passes through data URIs unchanged', () => {
    const dataUri = 'data:image/png;base64,abc123';
    expect(resolveImage(dataUri, 'node-1')).toBe(dataUri);
  });
});
