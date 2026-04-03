import { useEffect, useState } from 'react';
import {
  storageRead,
  ACTIVE_PROJECT_KEY,
  readObjects,
  writeObjects,
} from '../../lib/storage';
import { uid, slugify } from '../../lib/ids';
import { now, formatDate } from '../../lib/dates';
import { Button } from '../../components/Button';

interface Draft {
  id: string;
  projectId: string;
  objectType: string;
  title: string;
  slug: string;
  status: string;
  canonState: string;
  contentFormat: string;
  contentText: string;
  summary: string;
  keywords: string;
  createdAt: string;
  updatedAt: string;
}

export function WritingPage() {
  const [projectId, setProjectId] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const pid = storageRead<string>(ACTIVE_PROJECT_KEY, '');
    setProjectId(pid);
    if (pid) setDrafts(readObjects<Draft>(pid, 'draft_document'));
  }, []);

  function persist(updated: Draft[]) {
    setDrafts(updated);
    writeObjects(projectId, 'draft_document', updated);
  }

  function handleNew() {
    setEditing(null);
    setTitle('');
    setContent('');
    setShowNew(true);
  }

  function handleSave() {
    if (!title.trim()) return;
    const timestamp = now();
    if (editing) {
      const updated = drafts.map((d) =>
        d.id === editing.id
          ? { ...d, title: title.trim(), contentText: content, updatedAt: timestamp }
          : d
      );
      persist(updated);
    } else {
      const draft: Draft = {
        id: uid(),
        projectId,
        objectType: 'draft_document',
        title: title.trim(),
        slug: slugify(title),
        status: 'draft',
        canonState: 'none',
        contentFormat: 'markdown',
        contentText: content,
        summary: '',
        keywords: '',
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      persist([draft, ...drafts]);
    }
    setShowNew(false);
    setEditing(null);
  }

  function handleEdit(d: Draft) {
    setEditing(d);
    setTitle(d.title);
    setContent(d.contentText);
    setShowNew(true);
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this draft?')) return;
    persist(drafts.filter((d) => d.id !== id));
  }

  if (showNew) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-heading">
            {editing ? 'Edit Draft' : 'New Draft'}
          </h1>
          <Button variant="ghost" onClick={() => setShowNew(false)}>
            ← Back
          </Button>
        </div>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Content (Markdown)</label>
          <textarea
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your draft here…"
            style={{ minHeight: 400, fontFamily: 'var(--font-mono)', fontSize: 13 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" onClick={handleSave}>
            Save Draft
          </Button>
          <Button variant="ghost" onClick={() => setShowNew(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="page-heading">Writing</h1>
          <p className="page-subtitle">Draft documents and sections</p>
        </div>
        <Button variant="primary" onClick={handleNew}>
          + New Draft
        </Button>
      </div>
      <div className="entry-list">
        {drafts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✎</div>
            <div className="empty-state-text">No drafts yet.</div>
          </div>
        ) : (
          drafts.map((d) => (
            <div className="entry-card" key={d.id}>
              <div className="entry-card-header">
                <div>
                  <div className="entry-card-title">{d.title}</div>
                  <div className="entry-card-meta">
                    {d.contentFormat} · Updated {formatDate(d.updatedAt)}
                  </div>
                  {d.contentText && (
                    <div className="entry-card-excerpt">{d.contentText}</div>
                  )}
                </div>
                <div className="entry-card-actions">
                  <span className={`badge badge-${d.status}`}>{d.status}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(d)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(d.id)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
