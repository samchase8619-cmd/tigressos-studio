import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⌂' },
  { to: '/projects', label: 'Projects', icon: '◈' },
  { to: '/research', label: 'Research', icon: '◎' },
  { to: '/writing', label: 'Writing', icon: '✎' },
  { to: '/canon', label: 'Canon', icon: '★' },
  { to: '/search', label: 'Search', icon: '⌕' },
  { to: '/snapshots', label: 'Snapshots', icon: '◉' },
  { to: '/export', label: 'Export', icon: '⤴' },
  { to: '/extensions', label: 'Extensions', icon: '⊞' },
];

export function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">TigressOS</span>
      </div>
      <div className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
