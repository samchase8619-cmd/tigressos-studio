import { useEffect, useState } from 'react';
import {
  storageRead,
  ACTIVE_PROJECT_KEY,
  readObjects,
  writeObjects,
} from '../../lib/storage';
import { uid } from '../../lib/ids';
import { now, formatDateTime } from '../../lib/dates';
import { Button } from '../../components/Button';
import type { Snapshot } from '../../schemas/objects';

export function SnapshotsPage() {
  const [projectId, setProjectId] = useState('');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    const pid = storageRead<string>(ACTIVE_PROJECT_KEY, '');
    setProjectId(pid);
    if (pid) setSnapshots(readObjects<Snapshot>(pid, 'snapshot'));
  }, []);

  function persist(updated: Snapshot[]) {
    setSnapshots(updated);
    writeObjects(projectId, 'snapshot', updated);
  }

  function handleCreate() {
    if (!name.trim()) return;
    const allData: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      allData[key] = localStorage.getItem(key);
    }
    const snap: Snapshot = {
      id: uid(),
      projectId,
      name: name.trim(),
      description: desc.trim() || undefined,
      snapshotType: 'manual',
      manifestJson: JSON.stringify({ keys: Object.keys(allData), createdAt: now() }),
      createdAt: now(),
    };
    persist([snap, ...snapshots]);
    setName('');
    setDesc('');
  }

  function handleDelete(id: string) {
    if (!confirm('Delete snapshot?')) return;
    persist(snapshots.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h1 className="page-heading">Snapshots</h1>
      <p className="page-subtitle">Save and restore project states</p>

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-title">Create Snapshot</div>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Snapshot name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <Button variant="primary" onClick={handleCreate}>
          ◉ Save Snapshot
        </Button>
      </div>

      <div className="entry-list">
        {snapshots.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◉</div>
            <div className="empty-state-text">No snapshots yet.</div>
          </div>
        ) : (
          snapshots.map((s) => (
            <div className="entry-card" key={s.id}>
              <div className="entry-card-header">
                <div>
                  <div className="entry-card-title">{s.name}</div>
                  <div className="entry-card-meta">
                    {s.snapshotType} · {formatDateTime(s.createdAt)}
                  </div>
                  {s.description && (
                    <div className="entry-card-excerpt">{s.description}</div>
                  )}
                </div>
                <div className="entry-card-actions">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(s.id)}
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
