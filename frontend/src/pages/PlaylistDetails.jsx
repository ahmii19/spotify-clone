import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Clock, Plus, Trash2, ArrowLeft, Music, ListMusic } from 'lucide-react';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { getPlaylist, deletePlaylist, removeSongFromPlaylist } from '../services/playlistService';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSong, setQueue } from '../redux/slices/playerSlice';
import SongCard from '../components/ui/SongCard';
import { RowSkeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function PlaylistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const { data } = await getPlaylist(id);
        if (data.success) setPlaylist(data.data.playlist);
      } catch {
        toast.error('Playlist not found');
        navigate('/library');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id, navigate]);

  const handlePlayAll = () => {
    if (playlist?.songs?.length) {
      dispatch(setQueue(playlist.songs));
      dispatch(setCurrentSong(playlist.songs[0]));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this playlist?')) return;
    try {
      await deletePlaylist(id);
      toast.success('Playlist deleted');
      navigate('/library');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      await removeSongFromPlaylist(id, songId);
      setPlaylist((prev) => ({
        ...prev,
        songs: prev.songs.filter((s) => s._id !== songId),
      }));
      toast.success('Song removed');
    } catch {
      toast.error('Failed to remove song');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="skeleton h-48 w-full rounded mb-6" />
        <RowSkeleton count={5} />
      </div>
    );
  }

  if (!playlist) return null;

  const isOwner = playlist.user?._id === user?._id || playlist.user === user?._id;

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-b from-green-800 to-[var(--bg-surface)] p-6">
        <div className="flex items-end gap-6">
          <ImageWithFallback
            src={playlist.coverImage}
            alt={playlist.name}
            className="w-56 h-56 rounded object-cover shadow-2xl"
            fallback={
              <div className="w-56 h-56 rounded bg-[var(--bg-highlight)] flex items-center justify-center shadow-2xl">
                <ListMusic size={64} className="text-[var(--text-secondary)]" />
              </div>
            }
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase font-bold tracking-wider mb-2">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 truncate">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-sm text-[var(--text-secondary)] mb-2">{playlist.description}</p>
            )}
            <p className="text-sm text-[var(--text-secondary)]">
              {playlist.user?.name || 'Unknown'} · {playlist.songs?.length || 0} songs
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handlePlayAll}
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-xl"
          >
            <Play size={24} className="text-black ml-1" />
          </button>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="text-[var(--text-secondary)] hover:text-red-400 transition"
            >
              <Trash2 size={24} />
            </button>
          )}
        </div>

        {playlist.songs?.length > 0 ? (
          <div>
            <div className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-3 py-2 text-xs text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-color)] mb-2">
              <span>#</span>
              <span>Title</span>
              <span className="hidden md:block">Album</span>
              <span className="flex justify-end"><Clock size={14} /></span>
            </div>
            <div className="space-y-1">
              {playlist.songs.map((song, index) => (
                <div key={song._id} className="group grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-3 py-2 rounded-md items-center hover:bg-[var(--hover-bg-subtle)] transition-colors">
                  <div className="flex items-center justify-center">
                    <span className="group-hover:hidden text-sm text-[var(--text-secondary)]">{index + 1}</span>
                    <Play
                      size={16}
                      className="hidden group-hover:block text-[var(--text-primary)] cursor-pointer"
                      onClick={() => {
                        dispatch(setQueue(playlist.songs));
                        dispatch(setCurrentSong(song));
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-[var(--bg-highlight)] flex items-center justify-center shrink-0">
                      <Music size={16} className="text-[var(--text-secondary)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{song.artist?.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] truncate hidden md:block">{song.album?.title}</p>
                  <div className="flex items-center justify-end gap-2">
                    {isOwner && (
                      <button
                        onClick={() => handleRemoveSong(song._id)}
                        className="opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-400 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <span className="text-sm text-[var(--text-secondary)]">
                      {song.duration ? `${Math.floor(song.duration / 60)}:${String(Math.floor(song.duration % 60)).padStart(2, '0')}` : '0:00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Plus size={48} className="mx-auto mb-4 text-[var(--text-secondary)]" />
            <h3 className="text-xl font-bold mb-2">This playlist is empty</h3>
            <p className="text-[var(--text-secondary)]">Find songs to add to your playlist</p>
          </div>
        )}
      </div>
    </div>
  );
}
