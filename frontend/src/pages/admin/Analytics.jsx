import { useState, useEffect } from 'react';
import { Users, Music, Mic2, Disc3, ListMusic, Clock, TrendingUp, Headphones } from 'lucide-react';
import { getStats } from '../../services/adminService';
import { formatDuration } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getStats();
        if (data.success) setStats(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'bg-[#6366f1]/10', textColor: 'text-[#818cf8]' },
    { label: 'Total Songs', value: stats?.totalSongs, icon: Music, color: 'bg-[#10b981]/10', textColor: 'text-[#34d399]' },
    { label: 'Total Artists', value: stats?.totalArtists, icon: Mic2, color: 'bg-[#a855f7]/10', textColor: 'text-[#c084fc]' },
    { label: 'Total Albums', value: stats?.totalAlbums, icon: Disc3, color: 'bg-[#f59e0b]/10', textColor: 'text-[#fbbf24]' },
    { label: 'Total Playlists', value: stats?.totalPlaylists, icon: ListMusic, color: 'bg-[#ec4899]/10', textColor: 'text-[#f472b6]' },
    { label: 'Total Plays', value: stats?.totalPlays, icon: Headphones, color: 'bg-[#6366f1]/10', textColor: 'text-[#818cf8]' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={22} className="text-[#818cf8]" />
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-gray-500">Platform statistics and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-5 hover:border-[#45475a] transition-all duration-200">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={20} className={card.textColor} />
            </div>
            <p className="text-2xl font-bold text-white">{card.value?.toLocaleString() || 0}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Songs Per Month</h2>
          <p className="text-xs text-gray-500 mb-6">Upload trends for current year</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.songsPerMonth || []} barCategoryGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: '8px', color: '#fff', fontSize: '12px' }} cursor={{ fill: '#ffffff08' }} />
                <Bar dataKey="songs" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
          <h2 className="text-sm font-semibold text-white mb-1">User Registrations</h2>
          <p className="text-xs text-gray-500 mb-6">New users per month</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.userRegistrations || []} barCategoryGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: '8px', color: '#fff', fontSize: '12px' }} cursor={{ fill: '#ffffff08' }} />
                <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Top Played Songs</h2>
          {stats?.topPlayedSongs?.length > 0 ? (
            <div className="space-y-3">
              {stats.topPlayedSongs.map((song, i) => (
                <div key={song._id} className="flex items-center gap-3 pb-3 border-b border-[#ffffff08] last:border-0 last:pb-0">
                  <span className={`text-xs font-bold w-6 ${i < 3 ? 'text-[#818cf8]' : 'text-gray-600'}`}>#{i + 1}</span>
                  <div className="w-9 h-9 rounded-lg bg-[#ffffff08] flex items-center justify-center">
                    <Headphones size={16} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{song.title}</p>
                    <p className="text-xs text-gray-500 truncate">{song.artist?.name} · {formatDuration(song.duration)}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{song.plays?.toLocaleString() || 0} plays</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-4">No plays recorded yet</p>
          )}
        </div>

        <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Recently Uploaded Songs</h2>
          {stats?.recentSongs?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentSongs.map((song, i) => (
                <div key={song._id} className="flex items-center gap-3 pb-3 border-b border-[#ffffff08] last:border-0 last:pb-0">
                  <span className="text-xs text-gray-600 w-6">{i + 1}</span>
                  <div className="w-9 h-9 rounded-lg bg-[#ffffff08] flex items-center justify-center">
                    <Music size={16} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{song.title}</p>
                    <p className="text-xs text-gray-500 truncate">{song.artist?.name} · {formatDuration(song.duration)}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(song.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-4">No songs uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
