import { useMemo, useState } from 'react';
import { storageRead, ACTIVE_PROJECT_KEY, readObjects } from '../../lib/storage';
import { formatDate } from '../../lib/dates';

const OBJECT_TYPES = [
  'source',
  'research_note',
  'quote',
  'draft_document',
  'draft_section',
  'canon_entry',
] as const;

interface AnyObject {
  id: string;
  title?: string;
  sourceTitle?: string;
  status: string;
  updatedAt?: string;
  updated_at?: string;
  contentText?: string;
  summary?: string;
  coreIdea?: string;
  objectType?: string;
}

export function SearchPage() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const pid = storageRead<string>(ACTIVE_PROJECT_KEY, '');
    if (!pid) return [];
    const q = query.toLowerCase();
    const all: AnyObject[] = [];
    for (const type of OBJECT_TYPES) {
      const items = readObjects<AnyObject>(pid, type);
      for (const item of items) {
        const haystack = [
          item.title,
          item.sourceTitle,
          item.contentText,
          item.summary,
          item.coreIdea,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (haystack.includes(q)) {
          all.push({ ...item, objectType: type });
        }
      }
    }
    return all;
  }, [query]);

  return (
    <div>
      <h1 className="page-heading">Search</h1>
      <p className="page-subtitle">Full-text search across all objects</p>

      <div className="search-bar" style={{ marginBottom: 24 }}>
        <div className="search-input-wrap" style={{ flex: 1 }}>
          <span className="search-icon">⌕</span>
          <input
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all objects…"
            autoFocus
          />
        </div>
      </div>

      {query.trim() && (
        <div style={{ marginBottom: 12, color: 'var(--text-muted)', fontSize: 13 }}>
          {results.length} result{results.length !== 1 ? 's' : ''}
        </div>
      )}

      <div className="entry-list">
        {results.map((obj) => (
          <div className="entry-card" key={obj.id}>
            <div className="entry-card-header">
              <div>
                <div className="entry-card-title">
                  {obj.sourceTitle ?? obj.title ?? '(untitled)'}
                </div>
                <div className="entry-card-meta">
                  {obj.objectType} · {formatDate(obj.updatedAt ?? obj.updated_at ?? '')}
                </div>
                {(obj.contentText || obj.summary || obj.coreIdea) && (
                  <div className="entry-card-excerpt">
                    {obj.contentText ?? obj.summary ?? obj.coreIdea}
                  </div>
                )}
              </div>
              <span className={`badge badge-${obj.status}`}>{obj.status}</span>
            </div>
          </div>
        ))}
        {query.trim() && results.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">⌕</div>
            <div className="empty-state-text">No results for "{query}"</div>
          </div>
        )}
      </div>
    </div>
  );
}
