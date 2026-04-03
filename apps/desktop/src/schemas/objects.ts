import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(''),
  status: z.enum(['active', 'archived']),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ObjectTypeEnum = z.enum([
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
]);

export const CreateObjectSchema = z.object({
  projectId: z.string(),
  objectType: ObjectTypeEnum,
  title: z.string().min(1),
  slug: z.string().optional(),
  status: z
    .enum(['intake', 'draft', 'review', 'locked', 'archived'])
    .default('intake'),
  canonState: z
    .enum(['none', 'candidate', 'canonical', 'deprecated'])
    .default('none'),
  contentFormat: z
    .enum(['plain_text', 'markdown', 'tiptap_json', 'json'])
    .default('plain_text'),
  contentText: z.string().optional(),
  summary: z.string().optional(),
  keywords: z.string().optional(),
});
export type CreateObject = z.infer<typeof CreateObjectSchema>;

export const SnapshotSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  snapshotType: z.enum(['manual', 'autosave', 'pre_import', 'pre_export']),
  manifestJson: z.string(),
  createdAt: z.string(),
});
export type Snapshot = z.infer<typeof SnapshotSchema>;

// Research source — full Research App v2 model
export const SourceSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  sourceTitle: z.string().min(1),
  author: z.string().default(''),
  year: z.string().default(''),
  field: z.string().default('Systems Thinking'),
  coreIdea: z.string().min(1),
  keyConcepts: z.string().default(''),
  relevantEngine: z.string().default(''),
  applicationType: z.string().default('Case Study'),
  possibleIntegration: z.string().default(''),
  quoteArchive: z.string().default(''),
  critiqueNotes: z.string().default(''),
  status: z.enum(['intake', 'linked', 'archived']).default('intake'),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Source = z.infer<typeof SourceSchema>;
