import { useState, useEffect } from 'react';
import { getPlaylists, createPlaylist } from '../services/playlistService';
import { useNavigate } from 'react-router-dom';
import { ListMusic, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { GridSkeleton } from '../components/ui/Skeleton';
import ImageWithFallback from '../components/ui/ImageWithFallback';

export default function Library() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    try {
      const { data } = await getPlaylists({ limit: 50 });
      if (data.success) setPlaylists(data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    try {
      const { data } = await createPlaylist({ name: `My Playlist #${playlists.length + 1}` });
      if (data.success) {
        setPlaylists((prev) => [data.data.playlist, ...prev]);
        toast.success('Playlist created');
      }
    } catch {
      toast.error('Failed to create playlist');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="skeleton h-8 w-48 mb-6" />
        <GridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <button
          onClick={handleCreatePlaylist}
          className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
        >
          <Plus size={20} />
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-16">
          <ListMusic size={64} className="mx-auto mb-4 text-[var(--text-secondary)]" />
          <h3 className="text-xl font-bold mb-2">Create your first playlist</h3>
          <p className="text-[var(--text-secondary)] mb-6">It's easy, we'll help you</p>
          <button
            onClick={handleCreatePlaylist}
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition"
          >
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/playlist/${p._id}`)}
              className="bg-[var(--bg-elevated)] hover:bg-[var(--bg-highlight)] rounded-md p-4 cursor-pointer transition-colors group"
            >
              <div className="mb-4">
                <ImageWithFallback
                  src={p.coverImage}
                  alt={p.name}
                  className="w-full aspect-square rounded object-cover shadow-lg"
                  fallback={
                    <div className="w-full aspect-square rounded bg-[var(--bg-highlight)] flex items-center justify-center">
                      <ListMusic size={48} className="text-[var(--text-secondary)]" />
                    </div>
                  }
                />
              </div>
              <p className="font-medium text-sm truncate">{p.name}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {p.songs?.length || 0} songs
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
