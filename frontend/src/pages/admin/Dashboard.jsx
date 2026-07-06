import { useState, useEffect } from 'react';
import { Users, Music, Mic2, Disc3, ListMusic, Clock, Headphones } from 'lucide-react';
import { getStats } from '../../services/adminService';
import { formatDuration } from '../../utils/formatters';

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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Songs', value: stats?.totalSongs || 0, icon: Music, color: 'bg-green-500' },
    { label: 'Total Artists', value: stats?.totalArtists || 0, icon: Mic2, color: 'bg-purple-500' },
    { label: 'Total Albums', value: stats?.totalAlbums || 0, icon: Disc3, color: 'bg-orange-500' },
    { label: 'Total Playlists', value: stats?.totalPlaylists || 0, icon: ListMusic, color: 'bg-pink-500' },
  ];

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-[var(--bg-elevated)] rounded-lg p-5">
            <div className={`w-10 h-10 ${card.color} rounded-full flex items-center justify-center mb-3`}>
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-lg p-5">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Clock size={18} /> Recently Uploaded Songs
        </h2>
        {stats?.recentSongs?.length > 0 ? (
          <div className="space-y-2">
            {stats.recentSongs.map((song, i) => (
              <div key={song._id} className="flex items-center gap-3 py-2 border-b border-[var(--border-color)] last:border-0">
                <span className="text-xs text-[var(--text-secondary)] w-6">{i + 1}</span>
                <div className="w-9 h-9 rounded bg-[var(--bg-highlight)] flex items-center justify-center">
                  <Headphones size={16} className="text-[var(--text-secondary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{song.artist?.name}</p>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">{formatDuration(song.duration)}</span>
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
