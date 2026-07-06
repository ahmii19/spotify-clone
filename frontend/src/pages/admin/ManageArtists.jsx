import { useState, useEffect } from 'react';
import { Search, Trash2, Edit, Plus, X, Upload, Mic2 } from 'lucide-react';
import { getArtists, createArtist, updateArtist, deleteArtist } from '../../services/artistService';
import toast from 'react-hot-toast';
import ImageWithFallback from '../../components/ui/ImageWithFallback';

export default function ManageArtists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const { data } = await getArtists(params);
      if (data.success) {
        setArtists(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (editing) {
        await updateArtist(editing._id, fd);
        toast.success('Artist updated');
      } else {
        await createArtist(fd);
        toast.success('Artist created');
      }
      setShowForm(false);
      setEditing(null);
      fetchArtists();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete artist and all their songs/albums?')) return;
    try {
      await deleteArtist(id);
      setArtists((prev) => prev.filter((a) => a._id !== id));
      toast.success('Artist deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const openEdit = (artist) => {
    setEditing(artist);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Artists</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition text-sm">
          <Plus size={16} /> Add Artist
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artists..."
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-highlight)] rounded-md focus:outline-none focus:border-[var(--border-hover)] border border-transparent transition text-sm"
        />
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--text-secondary)] border-b border-[var(--border-color)] text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-4">Image</th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Genre</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Verified</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="py-2"><div className="skeleton h-12 rounded" /></td></tr>
              ))
            ) : artists.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-[var(--text-secondary)]">No artists found</td></tr>
            ) : (
              artists.map((artist) => (
                <tr key={artist._id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-bg-subtle)] transition-colors">
                  <td className="py-3 px-4">
                    <ImageWithFallback src={artist.image} alt={artist.name} className="w-9 h-9 rounded-full object-cover" fallback={<div className="w-9 h-9 rounded-full bg-[var(--bg-highlight)] flex items-center justify-center"><Mic2 size={16} className="text-[var(--text-secondary)]" /></div>} />
                  </td>
                  <td className="py-3 px-4 font-medium">{artist.name}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{artist.genre || '-'}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${artist.verified ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-[var(--text-secondary)]'}`}>
                      {artist.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(artist)} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded hover:bg-[var(--hover-bg)] transition">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(artist._id)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 rounded hover:bg-[var(--hover-bg)] transition">
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

      {showForm && (
        <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4" onClick={() => { setShowForm(false); setEditing(null); }}>
          <div className="bg-[var(--bg-highlight)] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing ? 'Edit Artist' : 'Add Artist'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" defaultValue={editing?.name} placeholder="Artist Name" required className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)]" />
              <input name="genre" defaultValue={editing?.genre} placeholder="Genre" className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)]" />
              <textarea name="bio" defaultValue={editing?.bio} placeholder="Bio" rows={3} className="w-full px-4 py-3 bg-[var(--bg-surface)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)] resize-none" />
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center gap-2 px-4 py-3 bg-[var(--bg-surface)] rounded-md border border-dashed border-white/20 cursor-pointer hover:border-white/40 transition text-sm">
                  <Upload size={16} />
                  <span className="text-[var(--text-secondary)]">{editing?.image ? 'Change Image' : 'Upload Image'}</span>
                  <input type="file" name="image" accept="image/*" className="hidden" />
                </label>
                {editing && (
                  <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <input type="checkbox" name="verified" defaultChecked={editing?.verified} />
                    Verified
                  </label>
                )}
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
