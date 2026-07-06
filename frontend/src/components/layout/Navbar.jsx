import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight, LogOut, User, Settings, Shield, Menu, Sun, Moon } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { clearPlayer } from '../../redux/slices/playerSlice';
import { logoutUser } from '../../services/authService';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
    }
    dispatch(logout());
    dispatch(clearPlayer());
    navigate('/login');
  };

  return (
    <header className="bg-[var(--bg-surface)]/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden w-8 h-8 rounded-full bg-[var(--overlay)] flex items-center justify-center hover:bg-[var(--overlay)] transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-[var(--overlay)] flex items-center justify-center hover:bg-[var(--overlay)] transition"
          aria-label="Go back"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-[var(--overlay)] flex items-center justify-center hover:bg-[var(--overlay)] transition"
          aria-label="Go forward"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full bg-[var(--hover-bg)] flex items-center justify-center hover:bg-[var(--hover-bg)] transition text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-[var(--overlay)] rounded-full p-1 pr-3 hover:bg-[var(--overlay)] transition"
            aria-label="User menu"
            aria-expanded={menuOpen}
          >
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-black font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium hidden sm:block text-[var(--text-primary)]">{user?.name}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-highlight)] rounded-md shadow-xl border border-[var(--border-color)] py-2 z-50">
              <button
                onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-bg)] w-full text-left text-sm text-[var(--text-primary)]"
              >
                <User size={18} />
                Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-bg)] w-full text-left text-sm text-[var(--text-primary)]"
              >
                <Settings size={18} />
                Settings
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => { navigate('/admin'); setMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-bg)] w-full text-left text-sm text-[var(--text-primary)]"
                >
                  <Shield size={18} />
                  Admin Dashboard
                </button>
              )}
              <hr className="border-[var(--border-color)] my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-bg)] w-full text-left text-sm text-red-400"
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
