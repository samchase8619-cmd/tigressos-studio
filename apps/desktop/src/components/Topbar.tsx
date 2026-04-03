import { useEffect, useState } from 'react';
import {
  storageRead,
  PROJECTS_KEY,
  ACTIVE_PROJECT_KEY,
} from '../lib/storage';
import type { Project } from '../schemas/objects';

export function Topbar() {
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    const projects = storageRead<Project[]>(PROJECTS_KEY, []);
    const activeId = storageRead<string>(ACTIVE_PROJECT_KEY, '');
    const active = projects.find((p) => p.id === activeId);
    if (active) setProjectName(active.name);
  }, []);

  return (
    <div className="topbar">
      <span className="topbar-title">TigressOS Studio</span>
      {projectName && (
        <>
          <span className="topbar-separator">›</span>
          <span className="topbar-project">{projectName}</span>
        </>
      )}
    </div>
  );
}
