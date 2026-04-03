CREATE VIRTUAL TABLE IF NOT EXISTS objects_fts USING fts5(
  id UNINDEXED,
  title,
  summary,
  content_text,
  keywords,
  content='objects',
  content_rowid='rowid'
);

CREATE TRIGGER IF NOT EXISTS objects_fts_insert AFTER INSERT ON objects BEGIN
  INSERT INTO objects_fts(rowid, id, title, summary, content_text, keywords)
  VALUES (new.rowid, new.id, new.title, new.summary, new.content_text, new.keywords);
END;

CREATE TRIGGER IF NOT EXISTS objects_fts_update AFTER UPDATE ON objects BEGIN
  INSERT INTO objects_fts(objects_fts, rowid, id, title, summary, content_text, keywords)
  VALUES ('delete', old.rowid, old.id, old.title, old.summary, old.content_text, old.keywords);
  INSERT INTO objects_fts(rowid, id, title, summary, content_text, keywords)
  VALUES (new.rowid, new.id, new.title, new.summary, new.content_text, new.keywords);
END;

CREATE TRIGGER IF NOT EXISTS objects_fts_delete AFTER DELETE ON objects BEGIN
  INSERT INTO objects_fts(objects_fts, rowid, id, title, summary, content_text, keywords)
  VALUES ('delete', old.rowid, old.id, old.title, old.summary, old.content_text, old.keywords);
END;
