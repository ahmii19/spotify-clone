import { useState, useEffect } from 'react';
import { Users, Music, Mic2, Disc3, Headphones, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getStats } from '../../services/adminService';
import { formatDuration } from '../../utils/formatters';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getStats();
        if (data.success) setStats(data.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Songs', value: stats?.totalSongs || 0, icon: Music, color: 'from-[#6366f1] to-[#818cf8]', bg: 'bg-[#6366f1]/10' },
    { label: 'Total Albums', value: stats?.totalAlbums || 0, icon: Disc3, color: 'from-[#a855f7] to-[#c084fc]', bg: 'bg-[#a855f7]/10' },
    { label: 'Total Artists', value: stats?.totalArtists || 0, icon: Mic2, color: 'from-[#ec4899] to-[#f472b6]', bg: 'bg-[#ec4899]/10' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-[#10b981] to-[#34d399]', bg: 'bg-[#10b981]/10' },
    { label: 'Total Plays', value: stats?.totalPlays || 0, icon: Headphones, color: 'from-[#f59e0b] to-[#fbbf24]', bg: 'bg-[#f59e0b]/10' },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const pieData = (stats?.topPlayedSongs || []).map((s, i) => ({
    name: s.title?.length > 15 ? s.title.slice(0, 15) + '...' : s.title,
    value: s.plays || 0,
    fullName: s.title,
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, admin. Here's your overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-[#1e1e2e] rounded-xl p-5 border border-[#313244] hover:border-[#45475a] transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon size={20} className="text-gray-200" />
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-white">{card.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Songs Uploaded Per Month</h2>
          <p className="text-xs text-gray-500 mb-6">Current year overview</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.songsPerMonth || []} barCategoryGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1e1e2e',
                    border: '1px solid #313244',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: '#ffffff08' }}
                />
                <Bar dataKey="songs" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Most Played Songs</h2>
          <p className="text-xs text-gray-500 mb-6">Top 5 songs by play count</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e1e2e',
                    border: '1px solid #313244',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-gray-400 truncate">{entry.fullName}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white mb-1">User Registrations</h2>
          <p className="text-xs text-gray-500 mb-6">Current year overview</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.userRegistrations || []} barCategoryGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1e1e2e',
                    border: '1px solid #313244',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: '#ffffff08' }}
                />
                <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Recently Uploaded Songs</h2>
            <p className="text-xs text-gray-500">Latest additions to the library</p>
          </div>
          <Clock size={16} className="text-gray-500" />
        </div>
        {stats?.recentSongs?.length > 0 ? (
          <div className="space-y-2">
            {stats.recentSongs.map((song, i) => (
              <div key={song._id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#ffffff08] transition">
                <span className="text-xs text-gray-600 w-5 font-mono">{i + 1}</span>
                <div className="w-9 h-9 rounded-lg bg-[#ffffff08] flex items-center justify-center">
                  <Music size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{song.title}</p>
                  <p className="text-xs text-gray-500 truncate">{song.artist?.name} · {formatDuration(song.duration)}</p>
                </div>
                <span className="text-xs text-gray-600">{new Date(song.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm py-4 text-center">No songs uploaded yet</p>
        )}
      </div>
    </div>
  );
}
