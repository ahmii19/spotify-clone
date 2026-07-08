import { useState, useEffect } from 'react';
import { Search, Trash2, Edit, Plus, X, Upload, Disc3 } from 'lucide-react';
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from '../../services/albumService';
import { getArtists } from '../../services/artistService';
import toast from 'react-hot-toast';
import ImageWithFallback from '../../components/ui/ImageWithFallback';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function ManageAlbums() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const limit = 20;

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const [albRes, artRes] = await Promise.all([getAlbums(params), getArtists({ limit: 200 })]);
      if (albRes.data.success) { setAlbums(albRes.data.data); setTotalPages(albRes.data.pagination.pages); }
      if (artRes.data.success) setArtists(artRes.data.data);
    } catch {
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAlbums(); }, [page]);
  useEffect(() => { setPage(1); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const fd = new FormData(e.target);
    try {
      if (editing) { await updateAlbum(editing._id, fd); toast.success('Album updated'); }
      else { await createAlbum(fd); toast.success('Album created'); }
      setShowForm(false); setEditing(null); fetchAlbums();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteAlbum(deleteTarget._id);
      setAlbums((prev) => prev.filter((a) => a._id !== deleteTarget._id));
      toast.success('Album deleted');
      setDeleteTarget(null);
    } catch { toast.error('Delete failed'); }
    finally { setDeleteLoading(false); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Albums</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your albums</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium rounded-lg hover:opacity-90 transition text-sm">
          <Plus size={16} /> Add Album
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search albums..." className="w-full pl-9 pr-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]/50 transition" />
      </div>

      <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-[#313244] text-[11px] uppercase tracking-wider">
              <th className="text-left py-3.5 px-4 font-medium">Cover</th>
              <th className="text-left py-3.5 px-4 font-medium">Title</th>
              <th className="text-left py-3.5 px-4 font-medium hidden md:table-cell">Artist</th>
              <th className="text-left py-3.5 px-4 font-medium hidden md:table-cell">Year</th>
              <th className="text-right py-3.5 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td colSpan={5} className="py-2"><div className="skeleton h-12 rounded mx-4" /></td></tr>
            )) : albums.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-500">
                <Disc3 size={40} className="mx-auto mb-3 text-gray-600" /> No albums found
              </td></tr>
            ) : albums.map((album) => (
              <tr key={album._id} className="border-b border-[#ffffff08] hover:bg-[#ffffff05] transition-colors">
                <td className="py-3 px-4">
                  <ImageWithFallback src={album.coverImage} alt={album.title} className="w-9 h-9 rounded object-cover" fallback={<div className="w-9 h-9 rounded bg-[#ffffff08] flex items-center justify-center"><Disc3 size={16} className="text-gray-400" /></div>} />
                </td>
                <td className="py-3 px-4 font-medium text-gray-200">{album.title}</td>
                <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{album.artist?.name || '-'}</td>
                <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{album.releaseYear || '-'}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setEditing(album); setShowForm(true); }} className="p-1.5 text-gray-500 hover:text-[#818cf8] transition rounded-lg hover:bg-[#ffffff08]"><Edit size={15} /></button>
                    <button onClick={() => setDeleteTarget(album)} className="p-1.5 text-gray-500 hover:text-red-400 transition rounded-lg hover:bg-[#ffffff08]"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => !deleteLoading && setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Album" message={`Delete "${deleteTarget?.title}" and all its songs? This cannot be undone.`} variant="danger" loading={deleteLoading} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); setEditing(null); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-[#1e1e2e] border border-[#313244] rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">{editing ? 'Edit Album' : 'Add Album'}</h3>
                <p className="text-xs text-gray-500">{editing ? 'Update album details' : 'Create a new album'}</p>
              </div>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-500 hover:text-gray-200 transition"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Album Title *</label>
                <input name="title" defaultValue={editing?.title} required className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500" placeholder="Album title" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Artist *</label>
                <select name="artist" defaultValue={editing?.artist?._id || editing?.artist} required className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#6366f1]/50 transition">
                  <option value="">Select Artist</option>
                  {artists.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Release Year</label>
                  <input name="releaseYear" type="number" defaultValue={editing?.releaseYear} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500" placeholder="2024" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Genre</label>
                  <input name="genre" defaultValue={editing?.genre} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500" placeholder="e.g. Pop" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Description</label>
                <textarea name="description" defaultValue={editing?.description} rows={2} className="w-full px-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]/50 transition placeholder-gray-500 resize-none" placeholder="Optional description" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Cover Image</label>
                <label className="flex items-center gap-3 px-4 py-2.5 bg-[#ffffff08] border border-dashed border-[#ffffff1a] rounded-lg cursor-pointer hover:border-[#6366f1]/50 transition">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{editing?.coverImage ? 'Change Cover' : 'Upload Cover'}</span>
                  <input type="file" name="coverImage" accept="image/*" className="hidden" />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-2.5 rounded-lg bg-[#ffffff08] text-gray-300 font-medium hover:bg-[#ffffff12] transition text-sm">Cancel</button>
                <button type="submit" disabled={formLoading} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium hover:opacity-90 transition disabled:opacity-50 text-sm">
                  {formLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
