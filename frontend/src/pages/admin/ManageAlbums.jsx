import { useState, useEffect } from 'react';
import { Search, Trash2, Edit, Plus, X, Upload, Disc3 } from 'lucide-react';
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from '../../services/albumService';
import { getArtists } from '../../services/artistService';
import toast from 'react-hot-toast';
import ImageWithFallback from '../../components/ui/ImageWithFallback';

export default function ManageAlbums() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const [albRes, artRes] = await Promise.all([
        getAlbums(params),
        getArtists({ limit: 200 }),
      ]);
      if (albRes.data.success) {
        setAlbums(albRes.data.data);
        setTotalPages(albRes.data.pagination.pages);
      }
      if (artRes.data.success) setArtists(artRes.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (editing) {
        await updateAlbum(editing._id, fd);
        toast.success('Album updated');
      } else {
        await createAlbum(fd);
        toast.success('Album created');
      }
      setShowForm(false);
      setEditing(null);
      fetchAlbums();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this album and all its songs?')) return;
    try {
      await deleteAlbum(id);
      setAlbums((prev) => prev.filter((a) => a._id !== id));
      toast.success('Album deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const openEdit = (album) => {
    setEditing(album);
    setShowForm(true);
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Albums</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition text-sm">
          <Plus size={16} /> Add Album
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search albums..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-highlight)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)] transition text-sm" />
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--text-secondary)] border-b border-[var(--border-color)] text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-4">Cover</th>
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Artist</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Year</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="py-2"><div className="skeleton h-12 rounded" /></td></tr>
              ))
            ) : albums.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-[var(--text-secondary)]">No albums found</td></tr>
            ) : (
              albums.map((album) => (
                <tr key={album._id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-bg-subtle)] transition-colors">
                  <td className="py-3 px-4">
                    <ImageWithFallback src={album.coverImage} alt={album.title} className="w-9 h-9 rounded object-cover" fallback={<div className="w-9 h-9 rounded bg-[var(--bg-highlight)] flex items-center justify-center"><Disc3 size={16} className="text-[var(--text-secondary)]" /></div>} />
                  </td>
                  <td className="py-3 px-4 font-medium">{album.title}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{album.artist?.name || '-'}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{album.releaseYear || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(album)} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--hover-bg)] transition"><Edit size={15} /></button>
                      <button onClick={() => handleDelete(album._id)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 rounded hover:bg-[var(--hover-bg)] transition"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4" onClick={() => { setShowForm(false); setEditing(null); }}>
          <div className="bg-[var(--bg-highlight)] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing ? 'Edit Album' : 'Add Album'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="title" defaultValue={editing?.title} placeholder="Album Title" required className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)]" />
              <select name="artist" defaultValue={editing?.artist?._id || editing?.artist} required className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)] text-[var(--text-primary)]">
                <option value="">Select Artist</option>
                {artists.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
              <input name="releaseYear" type="number" defaultValue={editing?.releaseYear} placeholder="Release Year" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)]" />
              <input name="genre" defaultValue={editing?.genre} placeholder="Genre" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)]" />
              <textarea name="description" defaultValue={editing?.description} placeholder="Description" rows={2} className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)] resize-none" />
              <div>
                <label className="text-xs text-[var(--text-secondary)] block mb-1">Cover Image</label>
                <label className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-surface)] rounded-md border border-dashed border-white/20 cursor-pointer hover:border-white/40 transition text-sm">
                  <Upload size={16} />
                  <span className="text-[var(--text-secondary)]">{editing?.coverImage ? 'Change Cover' : 'Upload Cover'}</span>
                  <input type="file" name="coverImage" accept="image/*" className="hidden" />
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-3 bg-white/10 rounded-full hover:bg-white/20 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
