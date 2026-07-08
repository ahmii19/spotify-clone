import { useState, useEffect } from 'react';
import { Search, Trash2, Ban, CheckCircle, Users } from 'lucide-react';
import { getUsers, deleteUser } from '../../services/userService';
import { toggleBlockUser } from '../../services/userService';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(null);
  const limit = 20;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const { data } = await getUsers(params);
      if (data.success) { setUsers(data.data); setTotalPages(data.pagination.pages); }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);
  useEffect(() => { setPage(1); }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteUser(deleteTarget._id);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      toast.success('User deleted');
      setDeleteTarget(null);
    } catch { toast.error('Delete failed'); }
    finally { setDeleteLoading(false); }
  };

  const handleBlock = async (id) => {
    setBlockLoading(id);
    try {
      const { data } = await toggleBlockUser(id);
      if (data.success) {
        setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
        toast.success(data.message);
      }
    } catch { toast.error('Failed to update user'); }
    finally { setBlockLoading(null); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage registered users</p>
        </div>
        <span className="text-xs text-gray-500 bg-[#ffffff08] px-3 py-1.5 rounded-lg">{users.length} users</span>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 bg-[#ffffff08] border border-[#ffffff0a] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]/50 transition" />
      </div>

      <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-[#313244] text-[11px] uppercase tracking-wider">
              <th className="text-left py-3.5 px-4 font-medium">User</th>
              <th className="text-left py-3.5 px-4 font-medium hidden md:table-cell">Email</th>
              <th className="text-left py-3.5 px-4 font-medium">Role</th>
              <th className="text-left py-3.5 px-4 font-medium">Status</th>
              <th className="text-left py-3.5 px-4 font-medium hidden lg:table-cell">Joined</th>
              <th className="text-right py-3.5 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td colSpan={6} className="py-2"><div className="skeleton h-12 rounded mx-4" /></td></tr>
            )) : users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-500">
                <Users size={40} className="mx-auto mb-3 text-gray-600" /> No users found
              </td></tr>
            ) : users.map((user) => (
              <tr key={user._id} className="border-b border-[#ffffff08] hover:bg-[#ffffff05] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-200">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${user.role === 'admin' ? 'bg-[#a855f7]/10 text-[#c084fc]' : 'bg-[#ffffff08] text-gray-400'}`}>{user.role}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.isBlocked ? 'bg-red-500/10 text-red-400' : 'bg-[#10b981]/10 text-[#34d399]'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleBlock(user._id)} disabled={blockLoading === user._id} className={`p-1.5 rounded-lg hover:bg-[#ffffff08] transition ${user.isBlocked ? 'text-[#34d399] hover:text-[#10b981]' : 'text-gray-500 hover:text-yellow-400'}`} title={user.isBlocked ? 'Unblock' : 'Block'}>
                      {blockLoading === user._id ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : (user.isBlocked ? <CheckCircle size={15} /> : <Ban size={15} />)}
                    </button>
                    <button onClick={() => setDeleteTarget(user)} className="p-1.5 text-gray-500 hover:text-red-400 transition rounded-lg hover:bg-[#ffffff08]"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-[#ffffff08] rounded-lg disabled:opacity-30 text-sm text-gray-400 hover:bg-[#ffffff12] transition">Prev</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 bg-[#ffffff08] rounded-lg disabled:opacity-30 text-sm text-gray-400 hover:bg-[#ffffff12] transition">Next</button>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => !deleteLoading && setDeleteTarget(null)} onConfirm={handleDelete} title="Delete User" message={`Delete user "${deleteTarget?.name}"? This cannot be undone.`} variant="danger" loading={deleteLoading} />
    </div>
  );
}
