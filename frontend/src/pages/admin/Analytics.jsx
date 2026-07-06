import { useState, useEffect } from 'react';
import { Users, Music, Mic2, Disc3, ListMusic, Clock, TrendingUp } from 'lucide-react';
import { getStats } from '../../services/adminService';
import { formatDuration } from '../../utils/formatters';

export default function Analytics() {
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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-lg" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Songs', value: stats?.totalSongs, icon: Music, color: 'bg-green-500', change: '+8%' },
    { label: 'Total Artists', value: stats?.totalArtists, icon: Mic2, color: 'bg-purple-500', change: '+5%' },
    { label: 'Total Albums', value: stats?.totalAlbums, icon: Disc3, color: 'bg-orange-500', change: '+15%' },
    { label: 'Total Playlists', value: stats?.totalPlaylists, icon: ListMusic, color: 'bg-pink-500', change: '+20%' },
  ];

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp size={24} /> Analytics
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-[var(--bg-elevated)] rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-full flex items-center justify-center`}>
                <card.icon size={20} />
              </div>
              <span className="text-xs text-green-400">{card.change}</span>
            </div>
            <p className="text-2xl font-bold">{card.value?.toLocaleString() || 0}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-lg p-5">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Clock size={18} /> Recently Uploaded Songs
        </h2>
        {stats?.recentSongs?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentSongs.map((song, i) => (
              <div key={song._id} className="flex items-center gap-3 pb-3 border-b border-[var(--border-color)] last:border-0 last:pb-0">
                <span className="text-xs text-[var(--text-secondary)] w-6">{i + 1}</span>
                <div className="w-10 h-10 rounded bg-[var(--bg-highlight)] flex items-center justify-center">
                  <Music size={18} className="text-[var(--text-secondary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{song.artist?.name} · {formatDuration(song.duration)}</p>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">{new Date(song.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-secondary)] text-sm py-4">No songs uploaded yet</p>
        )}
      </div>
    </div>
  );
}
