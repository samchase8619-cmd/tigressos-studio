export const OBJECT_STATUSES = [
  'intake',
  'draft',
  'review',
  'locked',
  'archived',
] as const;
export type ObjectStatus = typeof OBJECT_STATUSES[number];

export const DISK_TYPES = [
  'BOOT_DISK',
  'HARD_DRIVE',
  'FLOPPY_SAVE',
  'ARCHIVE',
  'DOCUMENT_BUILD',
] as const;
export type DiskType = typeof DISK_TYPES[number];

export const CORE_FUNCTIONS = [
  'BOOT',
  'LOAD',
  'SAVE',
  'UPDATE',
  'SEARCH',
  'ARCHIVE',
  'REBUILD',
  'QUERY',
] as const;
export type CoreFunction = typeof CORE_FUNCTIONS[number];

export const ARPANET_NODES = [
  'INPUT_GATEWAY',
  'KNOWLEDGE_COMPILER',
  'PACKET_INDEX',
  'ENGINE_ROUTER',
  'DOCUMENT_REASSEMBLER',
  'CASE_STUDY_BANK',
  'RESEARCH_BANK',
  'ARCHIVE_BANK',
  'ACTIVE_SESSION_BUFFER',
  'EXPORT_GATEWAY',
] as const;
export type ArpanetNode = typeof ARPANET_NODES[number];
