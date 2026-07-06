import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2, Edit, Music } from 'lucide-react';
import { getSongs, deleteSong, updateSong } from '../../services/songService';
import toast from 'react-hot-toast';
import { formatDuration } from '../../utils/formatters';

export default function ManageSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('-createdAt');
  const [genreFilter, setGenreFilter] = useState('');
  const [editingSong, setEditingSong] = useState(null);

  const limit = 10;

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const params = { page, limit, sort };
      if (search) params.search = search;
      if (genreFilter) params.genre = genreFilter;
      const { data } = await getSongs(params);
      if (data.success) {
        setSongs(data.data);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [page, sort, genreFilter]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this song?')) return;
    try {
      await deleteSong(id);
      setSongs((prev) => prev.filter((s) => s._id !== id));
      toast.success('Song deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await updateSong(editingSong._id, fd);
      toast.success('Song updated');
      setEditingSong(null);
      fetchSongs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const genres = [...new Set(songs.map((s) => s.genre).filter(Boolean))];

  const filtered = songs;

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Manage Songs</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-highlight)] border border-transparent rounded-md focus:outline-none focus:border-[var(--border-hover)] transition text-sm"
          />
        </div>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--bg-highlight)] border border-transparent rounded-md focus:outline-none focus:border-[var(--border-hover)] transition text-sm text-[var(--text-primary)]"
        >
          <option value="">All Genres</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 bg-[var(--bg-highlight)] border border-transparent rounded-md focus:outline-none focus:border-[var(--border-hover)] transition text-sm text-[var(--text-primary)]"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="-title">Title Z-A</option>
          <option value="-plays">Most Played</option>
        </select>
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--text-secondary)] border-b border-[var(--border-color)] text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">Artist</th>
                <th className="text-left py-3 px-4 hidden lg:table-cell">Album</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">Genre</th>
                <th className="text-left py-3 px-4">Duration</th>
                <th className="text-left py-3 px-4 hidden lg:table-cell">Created</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="py-2"><div className="skeleton h-12 rounded" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[var(--text-secondary)]">No songs found</td></tr>
              ) : (
                filtered.map((song) => (
                  <tr key={song._id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-bg-subtle)] transition-colors">
                    <td className="py-3 px-4 font-medium">{song.title}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{song.artist?.name || '-'}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] hidden lg:table-cell">{song.album?.title || '-'}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{song.genre || '-'}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{formatDuration(song.duration)}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] hidden lg:table-cell">
                      {new Date(song.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingSong(song)}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition rounded hover:bg-[var(--hover-bg)]"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(song._id)}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 transition rounded hover:bg-[var(--hover-bg)]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-color)]">
            <span className="text-xs text-[var(--text-secondary)]">{total} songs total</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded hover:bg-[var(--hover-bg)] disabled:opacity-30 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded hover:bg-[var(--hover-bg)] disabled:opacity-30 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {editingSong && (
        <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4" onClick={() => setEditingSong(null)}>
          <div className="bg-[var(--bg-highlight)] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Song</h3>
              <button onClick={() => setEditingSong(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><Edit size={18} /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input name="title" defaultValue={editingSong.title} placeholder="Title" required className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)]" />
              <input name="genre" defaultValue={editingSong.genre} placeholder="Genre" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)]" />
              <input name="duration" type="number" defaultValue={editingSong.duration} placeholder="Duration" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)]" />
              <div>
                <label className="text-xs text-[var(--text-secondary)] block mb-1">Audio File</label>
                <input type="file" name="audio" accept="audio/*" className="w-full text-sm" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingSong(null)} className="flex-1 py-3 bg-white/10 rounded-full hover:bg-white/20 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
