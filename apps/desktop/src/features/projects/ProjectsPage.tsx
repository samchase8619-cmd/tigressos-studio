import { useEffect, useState } from 'react';
import {
  storageRead,
  storageWrite,
  PROJECTS_KEY,
  ACTIVE_PROJECT_KEY,
} from '../../lib/storage';
import { uid, slugify } from '../../lib/ids';
import { now, formatDate } from '../../lib/dates';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import type { Project } from '../../schemas/objects';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    setProjects(storageRead<Project[]>(PROJECTS_KEY, []));
    setActiveId(storageRead<string>(ACTIVE_PROJECT_KEY, ''));
  }, []);

  function handleCreate() {
    if (!newName.trim()) return;
    const timestamp = now();
    const project: Project = {
      id: uid(),
      slug: slugify(newName),
      name: newName.trim(),
      description: newDesc.trim(),
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const updated = [project, ...projects];
    setProjects(updated);
    storageWrite(PROJECTS_KEY, updated);
    setShowNew(false);
    setNewName('');
    setNewDesc('');
  }

  function handleSetActive(id: string) {
    setActiveId(id);
    storageWrite(ACTIVE_PROJECT_KEY, id);
  }

  function handleArchive(id: string) {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, status: 'archived' as const, updatedAt: now() } : p
    );
    setProjects(updated);
    storageWrite(PROJECTS_KEY, updated);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="page-heading">Projects</h1>
          <p className="page-subtitle">Manage your TigressOS projects</p>
        </div>
        <Button variant="primary" onClick={() => setShowNew(true)}>
          + New Project
        </Button>
      </div>

      <div className="entry-list">
        {projects.map((p) => (
          <div className="entry-card" key={p.id}>
            <div className="entry-card-header">
              <div>
                <div className="entry-card-title">{p.name}</div>
                <div className="entry-card-meta">
                  {p.slug} · Created {formatDate(p.createdAt)}
                </div>
                {p.description && (
                  <div className="entry-card-excerpt">{p.description}</div>
                )}
              </div>
              <div className="entry-card-actions">
                <span className={`badge badge-${p.status}`}>{p.status}</span>
                {p.id !== activeId && p.status === 'active' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSetActive(p.id)}
                  >
                    Set Active
                  </Button>
                )}
                {p.id === activeId && (
                  <span className="badge badge-linked">Active</span>
                )}
                {p.status === 'active' && p.id !== activeId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(p.id)}
                  >
                    Archive
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <div className="empty-state-text">No projects yet.</div>
          </div>
        )}
      </div>

      <Dialog
        open={showNew}
        title="New Project"
        onClose={() => setShowNew(false)}
      >
        <div className="form-group">
          <label className="form-label">Project Name</label>
          <input
            className="form-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="My Studio"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Optional description"
          />
        </div>
        <div className="dialog-actions">
          <Button variant="ghost" onClick={() => setShowNew(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
