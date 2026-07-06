import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPlaylists, createPlaylist } from '../../services/playlistService';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const [playlists, setPlaylists] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const fetchPlaylists = async () => {
    try {
      const { data } = await getPlaylists({ limit: 50 });
      if (data.success) setPlaylists(data.data);
    } catch {
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    try {
      const { data } = await createPlaylist({ name: `My Playlist #${playlists.length + 1}` });
      if (data.success) {
        setPlaylists((prev) => [data.data.playlist, ...prev]);
        toast.success('Playlist created');
      }
    } catch {
      toast.error('Failed to create playlist');
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      isActive
        ? 'text-[var(--text-primary)] bg-white/10'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`;

  return (
    <aside className="bg-[var(--bg-surface)] flex flex-col h-full">
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 px-3 mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-500" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span className="font-bold text-lg">Spotify Clone</span>
        </div>

        <nav className="space-y-1 mb-4">
          <NavLink to="/" end className={linkClass}>
            <Home size={22} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            <Search size={22} />
            <span>Search</span>
          </NavLink>
          <NavLink to="/library" className={linkClass}>
            <Library size={22} />
            <span>Your Library</span>
          </NavLink>
        </nav>

        <div className="border-t border-[var(--border-color)] pt-4">
          <NavLink to="/liked-songs" className={linkClass}>
            <Heart size={22} className="text-white/70" />
            <span>Liked Songs</span>
          </NavLink>
          <button
            onClick={handleCreatePlaylist}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-full text-left"
          >
            <div             className="w-[22px] h-[22px] bg-[var(--text-secondary)] flex items-center justify-center rounded-sm">
              <Plus size={16} className="text-black" />
            </div>
            <span>Create Playlist</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-1">
          {playlists.map((p) => (
            <NavLink
              key={p._id}
              to={`/playlist/${p._id}`}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'text-[var(--text-primary)] bg-white/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`
              }
            >
              {p.name}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
