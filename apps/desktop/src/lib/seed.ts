import {
  PROJECTS_KEY,
  ACTIVE_PROJECT_KEY,
  storageRead,
  storageWrite,
  writeObjects,
} from './storage';
import { uid, slugify } from './ids';
import { now } from './dates';
import type { Project } from '../schemas/objects';
import type { Source } from '../schemas/objects';

export function boot(): void {
  const projects = storageRead<Project[]>(PROJECTS_KEY, []);
  if (projects.length > 0) return; // already seeded

  const timestamp = now();
  const projectId = uid();

  const demoProject: Project = {
    id: projectId,
    slug: 'demo-studio',
    name: 'Demo Studio',
    description: 'Auto-created demo project on first boot.',
    status: 'active',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  storageWrite(PROJECTS_KEY, [demoProject]);
  storageWrite(ACTIVE_PROJECT_KEY, projectId);

  // Seed sources
  const sources: Source[] = [
    {
      id: uid(),
      projectId,
      sourceTitle: 'Thinking in Systems',
      author: 'Donella H. Meadows',
      year: '2008',
      field: 'Systems Thinking',
      coreIdea:
        'Systems consist of elements, interconnections, and functions. Understanding feedback loops reveals leverage points for change.',
      keyConcepts: 'feedback loops, stocks, flows, leverage points, archetypes',
      relevantEngine: 'Five Petal Engine',
      applicationType: 'Case Study',
      possibleIntegration:
        'Map system archetypes to knowledge graph link types',
      quoteArchive:
        '"The behavior of a system cannot be known just by knowing the elements of which the system is made."',
      critiqueNotes: 'Foundational but may oversimplify social systems',
      status: 'linked',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: uid(),
      projectId,
      sourceTitle: 'The Knowledge-Creating Company',
      author: 'Ikujiro Nonaka & Hirotaka Takeuchi',
      year: '1995',
      field: 'Knowledge Management',
      coreIdea:
        'Organizational knowledge creation through SECI: Socialization, Externalization, Combination, Internalization.',
      keyConcepts: 'tacit knowledge, explicit knowledge, SECI model, ba',
      relevantEngine: 'Knowledge Compiler',
      applicationType: 'Theory',
      possibleIntegration: 'Align SECI with TigressOS ARPANET routing stages',
      quoteArchive:
        '"An organization cannot create knowledge on its own without the initiative of the individual."',
      critiqueNotes: 'Context-dependent; Japanese corporate culture assumed',
      status: 'linked',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
  writeObjects(projectId, 'source', sources);

  // Seed research notes
  const notes = [
    {
      id: uid(),
      projectId,
      objectType: 'research_note',
      title: 'Feedback Loop Analysis Framework',
      slug: slugify('Feedback Loop Analysis Framework'),
      status: 'draft',
      canonState: 'none',
      contentFormat: 'plain_text',
      contentText:
        'Identify balancing vs reinforcing loops. Document their effect on system behaviour over time.',
      summary: 'Framework for categorizing feedback loops in complex systems',
      keywords: 'feedback, loops, systems, analysis',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: uid(),
      projectId,
      objectType: 'research_note',
      title: 'Knowledge Routing via ARPANET Nodes',
      slug: slugify('Knowledge Routing via ARPANET Nodes'),
      status: 'draft',
      canonState: 'candidate',
      contentFormat: 'plain_text',
      contentText:
        'Route knowledge packets through INPUT_GATEWAY → KNOWLEDGE_COMPILER → PACKET_INDEX → ENGINE_ROUTER for structured processing.',
      summary: 'Notes on the TigressOS ARPANET knowledge routing model',
      keywords: 'ARPANET, routing, knowledge, packets',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
  writeObjects(projectId, 'research_note', notes);

  // Seed quote
  const quotes = [
    {
      id: uid(),
      projectId,
      objectType: 'quote',
      title: 'Meadows on System Behavior',
      slug: slugify('Meadows on System Behavior'),
      status: 'intake',
      canonState: 'none',
      contentFormat: 'plain_text',
      contentText:
        '"The behavior of a system cannot be known just by knowing the elements of which the system is made."',
      summary: 'Donella Meadows, Thinking in Systems (2008)',
      keywords: 'systems, behavior, elements, emergence',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
  writeObjects(projectId, 'quote', quotes);

  // Seed draft document
  const drafts = [
    {
      id: uid(),
      projectId,
      objectType: 'draft_document',
      title: 'TigressOS Architecture Overview',
      slug: slugify('TigressOS Architecture Overview'),
      status: 'draft',
      canonState: 'none',
      contentFormat: 'markdown',
      contentText:
        '# TigressOS Studio\n\nA creator-first, local-first desktop application for knowledge work.\n\n## Core Concepts\n\n- Object Pack format\n- ARPANET routing layer\n- Five Petal Engine\n',
      summary: 'High-level architecture overview document',
      keywords: 'architecture, overview, TigressOS',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
  writeObjects(projectId, 'draft_document', drafts);

  // Seed canon entry
  const canon = [
    {
      id: uid(),
      projectId,
      objectType: 'canon_entry',
      title: 'Systems Thinking as Foundation',
      slug: slugify('Systems Thinking as Foundation'),
      status: 'locked',
      canonState: 'canonical',
      contentFormat: 'plain_text',
      contentText:
        'Systems thinking is the foundational epistemology of TigressOS. All knowledge objects are understood in terms of their relationships, feedback loops, and emergent properties.',
      summary: 'Canon entry establishing systems thinking as core framework',
      keywords: 'systems thinking, canon, epistemology, foundation',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
  writeObjects(projectId, 'canon_entry', canon);
}
