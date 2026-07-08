import { useState, useEffect } from 'react';
import { Search, Trash2, ListMusic } from 'lucide-react';
import { getAllPlaylists } from '../../services/adminService';
import { deletePlaylist } from '../../services/playlistService';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      const { data } = await getAllPlaylists(params);
      if (data.success) setPlaylists(data.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchPlaylists(); }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deletePlaylist(deleteTarget._id);
      setPlaylists((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success('Playlist deleted');
      setDeleteTarget(null);
    } catch { toast.error('Delete failed'); }
    finally { setDeleteLoading(false); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories / Genres</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user playlists and categories</p>
        </div>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search playlists..." className="w-full pl-9 pr-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]/50 transition" />
      </div>

      <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-[#313244] text-[11px] uppercase tracking-wider">
              <th className="text-left py-3.5 px-4 font-medium">Name</th>
              <th className="text-left py-3.5 px-4 font-medium hidden md:table-cell">Created By</th>
              <th className="text-left py-3.5 px-4 font-medium">Songs</th>
              <th className="text-left py-3.5 px-4 font-medium hidden md:table-cell">Visibility</th>
              <th className="text-left py-3.5 px-4 font-medium hidden lg:table-cell">Created</th>
              <th className="text-right py-3.5 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td colSpan={6} className="py-2"><div className="skeleton h-12 rounded mx-4" /></td></tr>
            )) : playlists.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-500">
                <ListMusic size={40} className="mx-auto mb-3 text-gray-600" /> No playlists found
              </td></tr>
            ) : playlists.map((p) => (
              <tr key={p._id} className="border-b border-[#ffffff08] hover:bg-[#ffffff05] transition-colors">
                <td className="py-3 px-4 font-medium text-gray-200">{p.name}</td>
                <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{p.user?.name || 'Unknown'}</td>
                <td className="py-3 px-4 text-gray-400">{p.songs?.length || 0}</td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.isPublic ? 'bg-[#10b981]/10 text-[#34d399]' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {p.isPublic ? 'Public' : 'Private'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-gray-500 hover:text-red-400 transition rounded-lg hover:bg-[#ffffff08]"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => !deleteLoading && setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Playlist" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} variant="danger" loading={deleteLoading} />
    </div>
  );
}
