export const OBJECT_TYPES = [
  'source',
  'research_note',
  'quote',
  'draft_document',
  'draft_section',
  'canon_entry',
  'tag',
  'saved_search',
  'snapshot',
  'archive_record',
  'export_record',
  'extension_manifest',
] as const;

export type ObjectType = typeof OBJECT_TYPES[number];
