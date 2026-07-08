import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Music, Disc3, Mic2, Users, FolderOpen, BarChart3,
  FileText, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X,
  Bell, Search, Sun, Moon, User, Upload,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { clearPlayer } from '../../redux/slices/playerSlice';
import { logoutUser } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';

const sidebarLinks = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/upload-song', label: 'Upload Song', icon: Upload },
  { to: '/admin/manage-songs', label: 'Songs', icon: Music },
  { to: '/admin/albums', label: 'Albums', icon: Disc3 },
  { to: '/admin/artists', label: 'Artists', icon: Mic2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/playlists', label: 'Categories / Genres', icon: FolderOpen },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    dispatch(logout());
    dispatch(clearPlayer());
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
      isActive
        ? 'bg-[#6366f1]/15 text-[#818cf8] font-medium'
        : 'text-gray-400 hover:text-gray-200 hover:bg-[#ffffff08]'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#ffffff08]">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center">
                <LayoutDashboard size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white tracking-wide">MusicAdmin</h2>
                <p className="text-[10px] text-gray-500 tracking-wider uppercase">Management</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center mx-auto">
              <LayoutDashboard size={16} className="text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md hover:bg-[#ffffff08] transition ml-auto text-gray-500 hover:text-gray-300"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            <link.icon size={18} />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-[#ffffff08] space-y-0.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-[#ffffff08] transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-[#ffffff08] transition-all duration-200">
            <ChevronLeft size={18} />
            <span>Back to App</span>
          </NavLink>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-[#0f0f1a] text-white">
      <aside className={`hidden lg:flex flex-col bg-[#16162a] border-r border-[#ffffff08] transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-[#16162a]">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#16162a]/80 backdrop-blur-md border-b border-[#ffffff08] px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg bg-[#ffffff08] flex items-center justify-center hover:bg-[#ffffff12] transition"
            >
              <Menu size={18} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 lg:w-80 pl-9 pr-4 py-2 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]/50 transition"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/admin/manage-songs?search=${encodeURIComponent(e.target.value.trim())}`);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg bg-[#ffffff08] flex items-center justify-center hover:bg-[#ffffff12] transition text-gray-400 hover:text-gray-200"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#ffffff08] flex items-center justify-center hover:bg-[#ffffff12] transition text-gray-400 hover:text-gray-200 relative">
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#6366f1] rounded-full" />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-[#ffffff08] rounded-lg p-1.5 pr-3 hover:bg-[#ffffff12] transition ml-2"
              >
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-semibold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium text-gray-200 hidden sm:block">{user?.name}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e1e2e] rounded-xl shadow-2xl border border-[#313244] py-2 z-50">
                  <div className="px-4 py-3 border-b border-[#ffffff08]">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#ffffff08] w-full text-left text-sm text-gray-300"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings'); setUserMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#ffffff08] w-full text-left text-sm text-gray-300"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <hr className="border-[#ffffff08] my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#ffffff08] w-full text-left text-sm text-red-400"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#0f0f1a]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
