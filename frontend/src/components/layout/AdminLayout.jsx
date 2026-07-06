import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard, Upload, Music, Mic2, Disc3, Users, ListMusic, BarChart3,
  LogOut, ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { clearPlayer } from '../../redux/slices/playerSlice';
import { logoutUser } from '../../services/authService';

const sidebarLinks = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/upload-song', label: 'Upload Song', icon: Upload },
  { to: '/admin/manage-songs', label: 'Manage Songs', icon: Music },
  { to: '/admin/artists', label: 'Artists', icon: Mic2 },
  { to: '/admin/albums', label: 'Albums', icon: Disc3 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/playlists', label: 'Playlists', icon: ListMusic },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    dispatch(logout());
    dispatch(clearPlayer());
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm ${
      isActive ? 'bg-green-500/20 text-green-400' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg-subtle)]'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-xs text-[var(--text-secondary)]">Spotify Clone</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded hover:bg-[var(--hover-bg)] transition"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            <link.icon size={20} />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-[var(--border-color)]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[var(--text-secondary)] hover:text-red-400 hover:bg-[var(--hover-bg-subtle)] transition w-full"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg-subtle)] transition mt-1">
            <ChevronLeft size={20} />
            <span>Back to App</span>
          </NavLink>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-[var(--bg-base)] text-[var(--text-primary)]">
      <aside className={`hidden lg:flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-color)] transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'}`}>
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[var(--overlay)]" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-[var(--bg-surface)]">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-[var(--hover-bg)] rounded-md transition">
            <Menu size={20} />
          </button>
          <h2 className="font-bold">Admin Panel</h2>
        </header>

        <main className="flex-1 overflow-y-auto bg-[var(--bg-surface)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
