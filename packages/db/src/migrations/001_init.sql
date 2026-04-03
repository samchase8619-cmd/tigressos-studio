CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  default_view TEXT NOT NULL DEFAULT 'dashboard',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS objects (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  object_type TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT,
  status TEXT NOT NULL DEFAULT 'intake',
  canon_state TEXT NOT NULL DEFAULT 'none',
  content_format TEXT NOT NULL DEFAULT 'plain_text',
  content_text TEXT,
  content_blob TEXT,
  summary TEXT,
  keywords TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  archived_at TEXT,
  created_by TEXT,
  updated_by TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE INDEX IF NOT EXISTS idx_objects_project_type ON objects(project_id, object_type);
CREATE INDEX IF NOT EXISTS idx_objects_project_status ON objects(project_id, status);
CREATE INDEX IF NOT EXISTS idx_objects_project_canon ON objects(project_id, canon_state);
CREATE INDEX IF NOT EXISTS idx_objects_project_updated ON objects(project_id, updated_at);

CREATE TABLE IF NOT EXISTS object_meta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  object_id TEXT NOT NULL,
  meta_key TEXT NOT NULL,
  meta_value TEXT NOT NULL,
  FOREIGN KEY (object_id) REFERENCES objects(id)
);

CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  from_object_id TEXT NOT NULL,
  to_object_id TEXT NOT NULL,
  link_type TEXT NOT NULL,
  weight REAL DEFAULT 1.0,
  note TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS object_tags (
  object_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (object_id, tag_id)
);

CREATE TABLE IF NOT EXISTS snapshots (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  snapshot_type TEXT NOT NULL DEFAULT 'manual',
  db_checksum TEXT,
  manifest_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS change_log (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  object_id TEXT,
  event_type TEXT NOT NULL,
  event_payload TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exports (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  export_type TEXT NOT NULL,
  target_path TEXT NOT NULL,
  manifest_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS extensions (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'installed',
  manifest_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
