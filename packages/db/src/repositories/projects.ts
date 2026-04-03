// Projects repository — localStorage MVP implementation.
import type { ProjectRow } from '../schema';

const PROJECTS_KEY = 'tigressos-projects';
const ACTIVE_KEY = 'tigressos-active-project';

export function listProjects(): ProjectRow[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: ProjectRow[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProjectId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}
