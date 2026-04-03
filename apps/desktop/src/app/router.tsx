import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ProjectsPage } from '../features/projects/ProjectsPage';
import { ResearchPage } from '../features/research/ResearchPage';
import { WritingPage } from '../features/writing/WritingPage';
import { CanonPage } from '../features/canon/CanonPage';
import { SearchPage } from '../features/search/SearchPage';
import { SnapshotsPage } from '../features/snapshots/SnapshotsPage';
import { ExportPage } from '../features/export/ExportPage';
import { ExtensionsPage } from '../features/extensions/ExtensionsPage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const router: any = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'research', element: <ResearchPage /> },
      { path: 'writing', element: <WritingPage /> },
      { path: 'canon', element: <CanonPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'snapshots', element: <SnapshotsPage /> },
      { path: 'export', element: <ExportPage /> },
      { path: 'extensions', element: <ExtensionsPage /> },
    ],
  },
]);
