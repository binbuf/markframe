/**
 * Smart Asset Presets v2 — Local assets with deterministic random selection.
 *
 * Avatars: Auto-assigned from bundled faces. Optional gender filtering.
 * Images: Category keywords resolve to local photos. URLs pass through.
 */

const MALE_AVATARS = Array.from({ length: 6 }, (_, i) => `/assets/avatars/male-${i + 1}.jpg`);
const FEMALE_AVATARS = Array.from({ length: 6 }, (_, i) => `/assets/avatars/female-${i + 1}.jpg`);
const ALL_AVATARS = [...MALE_AVATARS, ...FEMALE_AVATARS];

const IMAGE_CATEGORIES: Record<string, string[]> = {
  food: ['/assets/images/food-1.jpg', '/assets/images/food-2.jpg'],
  nature: ['/assets/images/nature-1.jpg', '/assets/images/nature-2.jpg'],
  city: ['/assets/images/city-1.jpg', '/assets/images/city-2.jpg'],
  tech: ['/assets/images/tech-1.jpg', '/assets/images/tech-2.jpg'],
  fashion: ['/assets/images/fashion-1.jpg', '/assets/images/fashion-2.jpg'],
  travel: ['/assets/images/travel-1.jpg', '/assets/images/travel-2.jpg'],
};

/** Deterministic hash from a string — same input always yields same number. */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Pick an avatar from the local pool based on the node ID.
 * Always returns a path — avatars are auto-assigned when no src is given.
 * @param gender - Optional "male" or "female" to filter the pool.
 */
export function resolveAvatar(nodeId: string, gender?: string): string {
  const pool =
    gender === 'male' ? MALE_AVATARS :
    gender === 'female' ? FEMALE_AVATARS :
    ALL_AVATARS;
  return pool[hashCode(nodeId) % pool.length];
}

/**
 * Resolve an image src string.
 * - Category keyword (food, nature, etc.) → local image from that category's pool
 * - URL or path → pass through unchanged
 * - Empty/undefined → undefined
 */
export function resolveImage(src: string | undefined, nodeId: string): string | undefined {
  if (!src) return undefined;
  const category = IMAGE_CATEGORIES[src.toLowerCase()];
  if (category) return category[hashCode(nodeId) % category.length];
  return src;
}
