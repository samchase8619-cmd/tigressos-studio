import { useState } from 'react';
import { storageRead, ACTIVE_PROJECT_KEY } from '../../lib/storage';
import { Button } from '../../components/Button';

const OBJECT_TYPES = [
  'source',
  'research_note',
  'quote',
  'draft_document',
  'canon_entry',
] as const;

export function ExportPage() {
  const [exported, setExported] = useState(false);

  function handleExport() {
    const pid = storageRead<string>(ACTIVE_PROJECT_KEY, '');
    const data: Record<string, unknown> = { projectId: pid, exportedAt: new Date().toISOString() };
    for (const type of OBJECT_TYPES) {
      const key = `tigressos-${pid}-${type}`;
      const raw = localStorage.getItem(key);
      data[type] = raw ? JSON.parse(raw) : [];
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tigressos-export-${pid}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  return (
    <div>
      <h1 className="page-heading">Export</h1>
      <p className="page-subtitle">Export your project data</p>
      <div className="panel">
        <div className="panel-title">JSON Export</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 13 }}>
          Export all objects from the active project as a JSON file.
        </p>
        <Button variant="primary" onClick={handleExport}>
          ⤴ Export to JSON
        </Button>
        {exported && (
          <p style={{ color: 'var(--success)', marginTop: 12, fontSize: 13 }}>
            ✓ Export downloaded successfully.
          </p>
        )}
      </div>
    </div>
  );
}
