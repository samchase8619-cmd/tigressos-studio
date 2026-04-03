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

interface CanonEntry {
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

export function CanonPage() {
  const [projectId, setProjectId] = useState('');
  const [entries, setEntries] = useState<CanonEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [canonState, setCanonState] = useState('candidate');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const pid = storageRead<string>(ACTIVE_PROJECT_KEY, '');
    setProjectId(pid);
    if (pid) setEntries(readObjects<CanonEntry>(pid, 'canon_entry'));
  }, []);

  function persist(updated: CanonEntry[]) {
    setEntries(updated);
    writeObjects(projectId, 'canon_entry', updated);
  }

  function handleSave() {
    if (!title.trim()) return;
    const timestamp = now();
    const entry: CanonEntry = {
      id: uid(),
      projectId,
      objectType: 'canon_entry',
      title: title.trim(),
      slug: slugify(title),
      status: canonState === 'canonical' ? 'locked' : 'review',
      canonState,
      contentFormat: 'plain_text',
      contentText: content,
      summary: '',
      keywords: '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    persist([entry, ...entries]);
    setTitle('');
    setContent('');
    setShowForm(false);
  }

  function handlePromote(id: string) {
    persist(
      entries.map((e) =>
        e.id === id
          ? { ...e, canonState: 'canonical', status: 'locked', updatedAt: now() }
          : e
      )
    );
  }

  function handleDeprecate(id: string) {
    persist(
      entries.map((e) =>
        e.id === id
          ? { ...e, canonState: 'deprecated', updatedAt: now() }
          : e
      )
    );
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this canon entry?')) return;
    persist(entries.filter((e) => e.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="page-heading">Canon</h1>
          <p className="page-subtitle">Canonical knowledge entries</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Entry'}
        </Button>
      </div>

      {showForm && (
        <div className="panel" style={{ marginBottom: 24 }}>
          <div className="panel-title">New Canon Entry</div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Canon entry title"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="The canonical statement or knowledge…"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Canon State</label>
            <select
              className="form-select"
              value={canonState}
              onChange={(e) => setCanonState(e.target.value)}
            >
              <option value="candidate">Candidate</option>
              <option value="canonical">Canonical</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>
          <Button variant="primary" onClick={handleSave}>
            Save Entry
          </Button>
        </div>
      )}

      <div className="entry-list">
        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">★</div>
            <div className="empty-state-text">No canon entries yet.</div>
          </div>
        ) : (
          entries.map((e) => (
            <div className="entry-card" key={e.id}>
              <div className="entry-card-header">
                <div>
                  <div className="entry-card-title">{e.title}</div>
                  <div className="entry-card-meta">
                    Updated {formatDate(e.updatedAt)}
                  </div>
                  {e.contentText && (
                    <div className="entry-card-excerpt">{e.contentText}</div>
                  )}
                </div>
                <div className="entry-card-actions">
                  <span className={`badge badge-${e.canonState}`}>
                    {e.canonState}
                  </span>
                  {e.canonState === 'candidate' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePromote(e.id)}
                    >
                      Promote
                    </Button>
                  )}
                  {e.canonState !== 'deprecated' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeprecate(e.id)}
                    >
                      Deprecate
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(e.id)}
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
