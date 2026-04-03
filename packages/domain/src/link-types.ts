export const LINK_TYPES = [
  'supports',
  'references',
  'derived_from',
  'contradicts',
  'expands',
  'canonizes',
  'related_to',
  'supersedes',
  'grouped_with',
] as const;

export type LinkType = typeof LINK_TYPES[number];
