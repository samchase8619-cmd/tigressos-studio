// Extension permissions stub.
export const PERMISSIONS = ['read_objects', 'write_objects', 'export'] as const;
export type Permission = typeof PERMISSIONS[number];
