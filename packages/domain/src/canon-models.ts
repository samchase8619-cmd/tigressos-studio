export const CANON_STATES = [
  'none',
  'candidate',
  'canonical',
  'deprecated',
] as const;
export type CanonState = typeof CANON_STATES[number];
