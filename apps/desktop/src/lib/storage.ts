// Generic localStorage storage utilities.

export function storageRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch {
    return fallback;
  }
}

export function storageWrite<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function storageDelete(key: string): void {
  window.localStorage.removeItem(key);
}

// Key patterns per spec
export const PROJECTS_KEY = 'tigressos-projects';
export const ACTIVE_PROJECT_KEY = 'tigressos-active-project';

export function objectsKey(projectId: string, objectType: string): string {
  return `tigressos-${projectId}-${objectType}`;
}

export function readObjects<T>(projectId: string, objectType: string): T[] {
  return storageRead<T[]>(objectsKey(projectId, objectType), []);
}

export function writeObjects<T>(
  projectId: string,
  objectType: string,
  items: T[]
): void {
  storageWrite(objectsKey(projectId, objectType), items);
}
