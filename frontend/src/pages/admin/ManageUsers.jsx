import { useState, useEffect } from 'react';
import { Search, Trash2, Ban, CheckCircle } from 'lucide-react';
import { getUsers, deleteUser } from '../../services/userService';
import { toggleBlockUser } from '../../services/userService';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      const { data } = await getUsers(params);
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleBlock = async (id) => {
    try {
      const { data } = await toggleBlockUser(id);
      if (data.success) {
        setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
        toast.success(data.message);
      }
    } catch {
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="relative mb-4 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-highlight)] rounded-md focus:outline-none border border-transparent focus:border-[var(--border-hover)] transition text-sm"
        />
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[var(--text-secondary)] border-b border-[var(--border-color)] text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Email</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4 hidden lg:table-cell">Joined</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="py-2"><div className="skeleton h-12 rounded" /></td></tr>
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-[var(--text-secondary)]">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-bg-subtle)] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-black">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-[var(--text-secondary)]'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleBlock(user._id)}
                        className={`p-1.5 rounded hover:bg-[var(--hover-bg)] transition ${user.isBlocked ? 'text-green-400 hover:text-green-300' : 'text-[var(--text-secondary)] hover:text-yellow-400'}`}
                        title={user.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {user.isBlocked ? <CheckCircle size={15} /> : <Ban size={15} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 rounded hover:bg-[var(--hover-bg)] transition"
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
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-[var(--text-secondary)]">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-[var(--bg-highlight)] rounded disabled:opacity-30 text-sm hover:bg-[var(--hover-bg)] transition">Prev</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 bg-[var(--bg-highlight)] rounded disabled:opacity-30 text-sm hover:bg-[var(--hover-bg)] transition">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
