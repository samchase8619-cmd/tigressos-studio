// Schema definitions — currently using localStorage for MVP.
// These types mirror the SQL schema in migrations/001_init.sql.

export interface ProjectRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  default_view: string;
  created_at: string;
  updated_at: string;
}

export interface ObjectRow {
  id: string;
  project_id: string;
  object_type: string;
  title: string;
  slug?: string;
  status: string;
  canon_state: string;
  content_format: string;
  content_text?: string;
  summary?: string;
  keywords?: string;
  created_at: string;
  updated_at: string;
  archived_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface LinkRow {
  id: string;
  project_id: string;
  from_object_id: string;
  to_object_id: string;
  link_type: string;
  weight: number;
  note?: string;
  created_at: string;
}

export interface TagRow {
  id: string;
  project_id: string;
  name: string;
  color?: string;
  created_at: string;
}

export interface SnapshotRow {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  snapshot_type: string;
  db_checksum?: string;
  manifest_json: string;
  created_at: string;
}
