# TigressOS Studio — Architecture Decisions

## ADR-001: localStorage MVP

**Decision:** Use localStorage for all data persistence in the initial scaffold.

**Rationale:** Enables the app to run immediately in a browser without Tauri/SQLite setup. The storage layer is abstracted via `lib/storage.ts` so it can be swapped for SQLite/Tauri later.

**Key patterns:**
- Project list: `tigressos-projects`
- Active project: `tigressos-active-project`
- Objects: `tigressos-{projectId}-{objectType}`

## ADR-002: No external UI library

**Decision:** Plain CSS with CSS custom properties (design tokens) only.

**Rationale:** Matches spec requirement. Keeps bundle size minimal. Dark theme implemented via `--bg-*`, `--text-*`, `--accent` tokens.

## ADR-003: React Router v6

**Decision:** Use `react-router-dom` v6 with `createBrowserRouter`.

**Rationale:** Standard, well-supported, works with Vite.

## ADR-004: pnpm workspaces + Turbo

**Decision:** Use pnpm workspaces for monorepo, Turbo for task orchestration.

**Rationale:** Matches spec. Fast installs, good DX.

## ADR-005: Zod schemas

**Decision:** Zod for runtime schema validation in `apps/desktop/src/schemas/objects.ts`.

**Rationale:** Matches spec requirement. Type-safe forms and storage.
