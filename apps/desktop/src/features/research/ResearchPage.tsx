import { useEffect, useMemo, useState } from 'react';
import {
  storageRead,
  ACTIVE_PROJECT_KEY,
  readObjects,
  writeObjects,
} from '../../lib/storage';
import { uid } from '../../lib/ids';
import { now, formatDate } from '../../lib/dates';
import { Button } from '../../components/Button';
import type { Source } from '../../schemas/objects';

const FIELDS = [
  'Systems Thinking',
  'Knowledge Management',
  'Philosophy',
  'Technology',
  'Sociology',
  'Education',
  'Biology',
  'Economics',
  'Other',
];

const ENGINES = [
  'Five Petal Engine',
  'Knowledge Compiler',
  'ARPANET Router',
  'Document Reassembler',
  'Case Study Bank',
  'Other',
];

const APPLICATION_TYPES = [
  'Case Study',
  'Theory',
  'Framework',
  'Method',
  'Tool',
  'Example',
  'Critique',
];

const EMPTY_FORM: Omit<Source, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> =
  {
    sourceTitle: '',
    author: '',
    year: '',
    field: 'Systems Thinking',
    coreIdea: '',
    keyConcepts: '',
    relevantEngine: 'Five Petal Engine',
    applicationType: 'Case Study',
    possibleIntegration: '',
    quoteArchive: '',
    critiqueNotes: '',
    status: 'intake',
  };

export function ResearchPage() {
  const [projectId, setProjectId] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldFilter, setFieldFilter] = useState('All Fields');
  const [engineFilter, setEngineFilter] = useState('All Engines');
  const [applicationFilter, setApplicationFilter] = useState('All Applications');

  useEffect(() => {
    const pid = storageRead<string>(ACTIVE_PROJECT_KEY, '');
    setProjectId(pid);
    if (pid) {
      setSources(readObjects<Source>(pid, 'source'));
    }
  }, []);

  function persist(updated: Source[]) {
    setSources(updated);
    writeObjects(projectId, 'source', updated);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleClear() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sourceTitle.trim() || !form.coreIdea.trim()) return;
    const timestamp = now();
    const payload: Source = {
      ...form,
      id: editingId ?? uid(),
      projectId,
      status: form.relevantEngine ? 'linked' : 'intake',
      createdAt: editingId
        ? (sources.find((s) => s.id === editingId)?.createdAt ?? timestamp)
        : timestamp,
      updatedAt: timestamp,
    };
    if (editingId) {
      persist(sources.map((s) => (s.id === editingId ? payload : s)));
    } else {
      persist([payload, ...sources]);
    }
    handleClear();
  }

  function handleEdit(source: Source) {
    setForm({
      sourceTitle: source.sourceTitle,
      author: source.author,
      year: source.year,
      field: source.field,
      coreIdea: source.coreIdea,
      keyConcepts: source.keyConcepts,
      relevantEngine: source.relevantEngine,
      applicationType: source.applicationType,
      possibleIntegration: source.possibleIntegration,
      quoteArchive: source.quoteArchive,
      critiqueNotes: source.critiqueNotes,
      status: source.status,
    });
    setEditingId(source.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this source?')) return;
    persist(sources.filter((s) => s.id !== id));
  }

  function handleArchive(id: string) {
    persist(
      sources.map((s) =>
        s.id === id ? { ...s, status: 'archived', updatedAt: now() } : s
      )
    );
  }

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return sources.filter((s) => {
      if (
        q &&
        !s.sourceTitle.toLowerCase().includes(q) &&
        !s.author.toLowerCase().includes(q) &&
        !s.coreIdea.toLowerCase().includes(q) &&
        !s.keyConcepts.toLowerCase().includes(q)
      )
        return false;
      if (fieldFilter !== 'All Fields' && s.field !== fieldFilter) return false;
      if (engineFilter !== 'All Engines' && s.relevantEngine !== engineFilter)
        return false;
      if (
        applicationFilter !== 'All Applications' &&
        s.applicationType !== applicationFilter
      )
        return false;
      return true;
    });
  }, [sources, searchTerm, fieldFilter, engineFilter, applicationFilter]);

  return (
    <div>
      <h1 className="page-heading">Research</h1>
      <p className="page-subtitle">Capture and manage source material</p>

      {/* Form */}
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-title">
          {editingId ? '✎ Edit Source' : '+ New Source'}
        </div>
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Source Title *</label>
              <input
                className="form-input"
                name="sourceTitle"
                value={form.sourceTitle}
                onChange={handleChange}
                placeholder="Title of the source"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Author</label>
              <input
                className="form-input"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Author name(s)"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                className="form-input"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="e.g. 2008"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Field</label>
              <select
                className="form-select"
                name="field"
                value={form.field}
                onChange={handleChange}
              >
                {FIELDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Core Idea *</label>
            <textarea
              className="form-textarea"
              name="coreIdea"
              value={form.coreIdea}
              onChange={handleChange}
              placeholder="What is the central argument or insight?"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Key Concepts</label>
            <input
              className="form-input"
              name="keyConcepts"
              value={form.keyConcepts}
              onChange={handleChange}
              placeholder="Comma-separated concepts"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Relevant Engine</label>
              <select
                className="form-select"
                name="relevantEngine"
                value={form.relevantEngine}
                onChange={handleChange}
              >
                <option value="">None</option>
                {ENGINES.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Application Type</label>
              <select
                className="form-select"
                name="applicationType"
                value={form.applicationType}
                onChange={handleChange}
              >
                {APPLICATION_TYPES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Possible Integration</label>
            <textarea
              className="form-textarea"
              name="possibleIntegration"
              value={form.possibleIntegration}
              onChange={handleChange}
              placeholder="How might this integrate with TigressOS?"
              style={{ minHeight: 64 }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Quote Archive</label>
            <textarea
              className="form-textarea"
              name="quoteArchive"
              value={form.quoteArchive}
              onChange={handleChange}
              placeholder="Key quotes from the source"
              style={{ minHeight: 64 }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Critique Notes</label>
            <textarea
              className="form-textarea"
              name="critiqueNotes"
              value={form.critiqueNotes}
              onChange={handleChange}
              placeholder="Limitations, disagreements, caveats"
              style={{ minHeight: 64 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" type="submit">
              {editingId ? 'Update Source' : 'Save Source'}
            </Button>
            {editingId && (
              <Button variant="ghost" type="button" onClick={handleClear}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Search + Filters */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search title, author, core idea, concepts…"
          />
        </div>
        <select
          className="form-select"
          style={{ width: 160 }}
          value={fieldFilter}
          onChange={(e) => setFieldFilter(e.target.value)}
        >
          <option>All Fields</option>
          {FIELDS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <select
          className="form-select"
          style={{ width: 180 }}
          value={engineFilter}
          onChange={(e) => setEngineFilter(e.target.value)}
        >
          <option>All Engines</option>
          {ENGINES.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <select
          className="form-select"
          style={{ width: 180 }}
          value={applicationFilter}
          onChange={(e) => setApplicationFilter(e.target.value)}
        >
          <option>All Applications</option>
          {APPLICATION_TYPES.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Source list */}
      <div className="entry-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <div className="empty-state-text">
              No sources found. Add one above.
            </div>
          </div>
        ) : (
          filtered.map((source) => (
            <div className="entry-card" key={source.id}>
              <div className="entry-card-header">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="entry-card-title">{source.sourceTitle}</div>
                  <div className="entry-card-meta">
                    {[source.author, source.year, source.field]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  <div className="entry-card-excerpt">{source.coreIdea}</div>
                  {source.keyConcepts && (
                    <div
                      className="entry-card-meta"
                      style={{ marginTop: 4 }}
                    >
                      🔑 {source.keyConcepts}
                    </div>
                  )}
                </div>
                <div className="entry-card-actions">
                  <span className={`badge badge-${source.status}`}>
                    {source.status}
                  </span>
                  {source.status !== 'archived' && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(source)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchive(source.id)}
                      >
                        Archive
                      </Button>
                    </>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(source.id)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 8,
                  flexWrap: 'wrap',
                }}
              >
                {source.relevantEngine && (
                  <span className="badge badge-linked">
                    {source.relevantEngine}
                  </span>
                )}
                {source.applicationType && (
                  <span className="badge badge-intake">
                    {source.applicationType}
                  </span>
                )}
                <span
                  className="text-muted"
                  style={{ fontSize: 11, marginLeft: 'auto' }}
                >
                  {formatDate(source.updatedAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
