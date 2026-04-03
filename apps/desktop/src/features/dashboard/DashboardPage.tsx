import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  storageRead,
  PROJECTS_KEY,
  ACTIVE_PROJECT_KEY,
  readObjects,
} from '../../lib/storage';
import { formatDateTime } from '../../lib/dates';
import type { Project } from '../../schemas/objects';
import { Button } from '../../components/Button';

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
  objectType?: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('—');
  const [totalCount, setTotalCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<AnyObject[]>([]);

  useEffect(() => {
    const projects = storageRead<Project[]>(PROJECTS_KEY, []);
    const activeId = storageRead<string>(ACTIVE_PROJECT_KEY, '');
    const active = projects.find((p) => p.id === activeId);
    if (!active) return;
    setProjectName(active.name);

    const allObjects: AnyObject[] = [];
    for (const type of OBJECT_TYPES) {
      const items = readObjects<AnyObject>(activeId, type);
      allObjects.push(...items.map((item) => ({ ...item, objectType: type })));
    }

    setTotalCount(allObjects.length);

    const counts: Record<string, number> = {};
    for (const obj of allObjects) {
      const s = obj.status ?? 'unknown';
      counts[s] = (counts[s] ?? 0) + 1;
    }
    setStatusCounts(counts);

    const sorted = [...allObjects].sort((a, b) => {
      const aDate = a.updatedAt ?? a.updated_at ?? '';
      const bDate = b.updatedAt ?? b.updated_at ?? '';
      return bDate.localeCompare(aDate);
    });
    setRecent(sorted.slice(0, 5));
  }, []);

  return (
    <div>
      <h1 className="page-heading">Dashboard</h1>
      <p className="page-subtitle">Active project: {projectName}</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Objects</div>
          <div className="stat-value">{totalCount}</div>
        </div>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div className="stat-card" key={status}>
            <div className="stat-label">{status}</div>
            <div className="stat-value">{count}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="panel-title" style={{ marginBottom: 12 }}>
          Recently Updated
        </div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No objects yet.</div>
          </div>
        ) : (
          <div className="entry-list">
            {recent.map((obj) => (
              <div className="entry-card" key={obj.id}>
                <div className="entry-card-header">
                  <span className="entry-card-title">
                    {obj.sourceTitle ?? obj.title ?? '(untitled)'}
                  </span>
                  <span
                    className={`badge badge-${obj.status}`}
                    style={{ flexShrink: 0 }}
                  >
                    {obj.status}
                  </span>
                </div>
                <div className="entry-card-meta">
                  {obj.objectType} ·{' '}
                  {formatDateTime(obj.updatedAt ?? obj.updated_at ?? '')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-links">
        <Button variant="primary" onClick={() => navigate('/research')}>
          ◎ Research
        </Button>
        <Button variant="secondary" onClick={() => navigate('/writing')}>
          ✎ Writing
        </Button>
        <Button variant="secondary" onClick={() => navigate('/canon')}>
          ★ Canon
        </Button>
      </div>
    </div>
  );
}
