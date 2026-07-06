import { useState, useEffect } from 'react';
import { Search, Trash2, ListMusic } from 'lucide-react';
import { getAllPlaylists } from '../../services/adminService';
import { deletePlaylist } from '../../services/playlistService';
import toast from 'react-hot-toast';

export default function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      const { data } = await getAllPlaylists(params);
      if (data.success) setPlaylists(data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [search]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this playlist?')) return;
    try {
      await deletePlaylist(id);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
      toast.success('Playlist deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Playlists</h1>

      <div className="relative mb-4 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search playlists..."
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-highlight)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)] transition text-sm"
        />
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--text-secondary)] border-b border-[var(--border-color)] text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">User</th>
              <th className="text-left py-3 px-4">Songs</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Visibility</th>
              <th className="text-left py-3 px-4 hidden lg:table-cell">Created</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="py-2"><div className="skeleton h-12 rounded" /></td></tr>
              ))
            ) : playlists.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-[var(--text-secondary)]">
                <ListMusic size={40} className="mx-auto mb-3 text-[#555]" />
                No playlists found
              </td></tr>
            ) : (
              playlists.map((p) => (
                <tr key={p._id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-bg-subtle)] transition-colors">
                  <td className="py-3 px-4 font-medium">{p.name}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{p.user?.name || 'Unknown'}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{p.songs?.length || 0}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {p.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] hidden lg:table-cell">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 rounded hover:bg-[var(--hover-bg)] transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
