import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Trash2, Edit, Eye, Music, Upload, X } from 'lucide-react';
import { getSongs, deleteSong, updateSong } from '../../services/songService';
import { getArtists } from '../../services/artistService';
import { getAlbums } from '../../services/albumService';
import toast from 'react-hot-toast';
import { formatDuration } from '../../utils/formatters';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function ManageSongs() {
  const [searchParams] = useSearchParams();
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('-createdAt');
  const [genreFilter, setGenreFilter] = useState('');
  const [editingSong, setEditingSong] = useState(null);
  const [viewingSong, setViewingSong] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [artworkFile, setArtworkFile] = useState(null);

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

  const fetchFormData = async () => {
    try {
      const [aRes, alRes] = await Promise.all([
        getArtists({ limit: 200 }),
        getAlbums({ limit: 200 }),
      ]);
      if (aRes.data.success) setArtists(aRes.data.data);
      if (alRes.data.success) setAlbums(alRes.data.data);
    } catch {}
  };

  useEffect(() => {
    fetchSongs();
  }, [page, sort, genreFilter]);

  useEffect(() => {
    if (search || searchParams.get('search')) {
      const debounce = setTimeout(() => {
        setPage(1);
        fetchSongs();
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      setPage(1);
    }
  }, [search]);

  useEffect(() => {
    if (editingSong || viewingSong) fetchFormData();
  }, [editingSong, viewingSong]);

  useEffect(() => {
    if (searchParams.get('search')) {
      setSearch(searchParams.get('search'));
    }
  }, [searchParams]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteSong(deleteTarget._id);
      setSongs((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success('Song deleted successfully');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete song');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const fd = new FormData(e.target);
    if (audioFile) fd.append('audio', audioFile);
    try {
      await updateSong(editingSong._id, fd);
      toast.success('Song updated successfully');
      setEditingSong(null);
      setAudioFile(null);
      setArtworkFile(null);
      fetchSongs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const genres = [...new Set(songs.map((s) => s.genre).filter(Boolean))];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Songs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your music library</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]/50 transition"
          />
        </div>
        <select
          value={genreFilter}
          onChange={(e) => { setGenreFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#6366f1]/50 transition"
        >
          <option value="">All Genres</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#6366f1]/50 transition"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="-title">Title Z-A</option>
          <option value="-plays">Most Played</option>
        </select>
      </div>

      <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-[#313244] text-[11px] uppercase tracking-wider">
                <th className="text-left py-3.5 px-4 font-medium">Song</th>
                <th className="text-left py-3.5 px-4 font-medium hidden md:table-cell">Artist</th>
                <th className="text-left py-3.5 px-4 font-medium hidden lg:table-cell">Album</th>
                <th className="text-left py-3.5 px-4 font-medium hidden md:table-cell">Genre</th>
                <th className="text-left py-3.5 px-4 font-medium">Duration</th>
                <th className="text-left py-3.5 px-4 font-medium hidden lg:table-cell">Upload Date</th>
                <th className="text-left py-3.5 px-4 font-medium hidden md:table-cell">Status</th>
                <th className="text-right py-3.5 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="py-2"><div className="skeleton h-12 rounded mx-4" /></td>
                  </tr>
                ))
              ) : songs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    <Music size={40} className="mx-auto mb-3 text-gray-600" />
                    No songs found
                  </td>
                </tr>
              ) : (
                songs.map((song) => (
                  <tr key={song._id} className="border-b border-[#ffffff08] hover:bg-[#ffffff05] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#ffffff08] flex items-center justify-center">
                          <Music size={14} className="text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-200">{song.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{song.artist?.name || '-'}</td>
                    <td className="py-3 px-4 text-gray-400 hidden lg:table-cell">{song.album?.title || '-'}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {song.genre ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/10 text-[#818cf8]">{song.genre}</span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-xs">{formatDuration(song.duration)}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell">
                      {new Date(song.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#34d399]">Active</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingSong(song)}
                          className="p-1.5 text-gray-500 hover:text-gray-200 transition rounded-lg hover:bg-[#ffffff08]"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setEditingSong(song)}
                          className="p-1.5 text-gray-500 hover:text-[#818cf8] transition rounded-lg hover:bg-[#ffffff08]"
                          title="Edit Song"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(song)}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition rounded-lg hover:bg-[#ffffff08]"
                          title="Delete Song"
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#313244]">
            <span className="text-xs text-gray-500">{total} songs total</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-[#ffffff08] disabled:opacity-30 transition text-gray-400"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-400">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-[#ffffff08] disabled:opacity-30 transition text-gray-400"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Song"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />

      {viewingSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setViewingSong(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-[#1e1e2e] border border-[#313244] rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewingSong(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 transition">
              <X size={18} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center">
                <Music size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{viewingSong.title}</h3>
                <p className="text-sm text-gray-400">{viewingSong.artist?.name || 'Unknown Artist'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#ffffff08] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Album</p>
                <p className="text-gray-200">{viewingSong.album?.title || 'Single'}</p>
              </div>
              <div className="bg-[#ffffff08] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Genre</p>
                <p className="text-gray-200">{viewingSong.genre || '-'}</p>
              </div>
              <div className="bg-[#ffffff08] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Duration</p>
                <p className="text-gray-200 font-mono">{formatDuration(viewingSong.duration)}</p>
              </div>
              <div className="bg-[#ffffff08] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Plays</p>
                <p className="text-gray-200">{viewingSong.plays?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-[#ffffff08] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Upload Date</p>
                <p className="text-gray-200">{new Date(viewingSong.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="bg-[#ffffff08] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Status</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#34d399]">Active</span>
              </div>
            </div>
            {viewingSong.description && (
              <div className="mt-4 bg-[#ffffff08] rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Description</p>
                <p className="text-gray-200 text-sm">{viewingSong.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editingSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setEditingSong(null); setAudioFile(null); setArtworkFile(null); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-[#1e1e2e] border border-[#313244] rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Edit Song</h3>
                <p className="text-xs text-gray-500">Update song details</p>
              </div>
              <button onClick={() => { setEditingSong(null); setAudioFile(null); setArtworkFile(null); }} className="text-gray-500 hover:text-gray-200 transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Title *</label>
                <input name="title" defaultValue={editingSong.title} required className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500" placeholder="Song title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Artist *</label>
                  <select name="artist" defaultValue={editingSong.artist?._id || editingSong.artist} required className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#6366f1]/50 transition">
                    <option value="">Select Artist</option>
                    {artists.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Album</label>
                  <select name="album" defaultValue={editingSong.album?._id || editingSong.album || ''} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#6366f1]/50 transition">
                    <option value="">No Album (Single)</option>
                    {albums.map((a) => <option key={a._id} value={a._id}>{a.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Genre</label>
                  <input name="genre" defaultValue={editingSong.genre} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500" placeholder="e.g. Pop" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Duration (seconds)</label>
                  <input name="duration" type="number" step="0.01" defaultValue={editingSong.duration} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Description</label>
                <textarea name="description" defaultValue={editingSong.description} rows={2} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500 resize-none" placeholder="Optional description" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Replace Song File</label>
                <label className="flex items-center gap-3 px-4 py-2.5 bg-[#ffffff08] border border-dashed border-[#ffffff1a] rounded-lg cursor-pointer hover:border-[#6366f1]/50 transition">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{audioFile ? audioFile.name : 'Choose audio file'}</span>
                  <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} className="hidden" />
                </label>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Replace Artwork</label>
                <label className="flex items-center gap-3 px-4 py-2.5 bg-[#ffffff08] border border-dashed border-[#ffffff1a] rounded-lg cursor-pointer hover:border-[#6366f1]/50 transition">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{artworkFile ? artworkFile.name : 'Choose artwork image'}</span>
                  <input type="file" accept="image/*" onChange={(e) => setArtworkFile(e.target.files[0])} className="hidden" />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setEditingSong(null); setAudioFile(null); setArtworkFile(null); }} className="flex-1 py-2.5 rounded-lg bg-[#ffffff08] text-gray-300 font-medium hover:bg-[#ffffff12] transition text-sm">Cancel</button>
                <button type="submit" disabled={updateLoading} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium hover:opacity-90 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                  {updateLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
