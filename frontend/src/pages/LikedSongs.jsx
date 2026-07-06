import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { getLikedSongs } from '../services/likeService';
import SongCard from '../components/ui/SongCard';
import { RowSkeleton } from '../components/ui/Skeleton';

export default function LikedSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const { data } = await getLikedSongs();
        if (data.success) setSongs(data.data.songs);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="skeleton h-48 w-full rounded mb-6" />
        <RowSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-b from-purple-800 to-[var(--bg-surface)] p-6">
        <div className="flex items-end gap-6">
          <div className="w-56 h-56 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center shadow-2xl">
            <Heart size={64} className="text-[var(--text-primary)]" fill="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase font-bold tracking-wider mb-2">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Liked Songs</h1>
            <p className="text-sm text-[var(--text-secondary)]">{songs.length} songs</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {songs.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto mb-4 text-[var(--text-secondary)]" />
            <h3 className="text-xl font-bold mb-2">Songs you like will appear here</h3>
            <p className="text-[var(--text-secondary)]">Save songs by tapping the heart icon</p>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song) => (
              <SongCard key={song._id} song={song} songs={songs} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
