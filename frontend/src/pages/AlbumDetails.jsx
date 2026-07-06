import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Clock, Music, Disc3 } from 'lucide-react';
import { getAlbum } from '../services/albumService';
import { useDispatch } from 'react-redux';
import { setCurrentSong, setQueue } from '../redux/slices/playerSlice';
import SongCard from '../components/ui/SongCard';
import { RowSkeleton } from '../components/ui/Skeleton';
import { formatDuration } from '../utils/formatters';
import ImageWithFallback from '../components/ui/ImageWithFallback';

export default function AlbumDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const { data } = await getAlbum(id);
        if (data.success) {
          setAlbum(data.data.album);
          setSongs(data.data.songs);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  const handlePlayAll = () => {
    if (songs.length) {
      dispatch(setQueue(songs));
      dispatch(setCurrentSong(songs[0]));
    }
  };

  const totalDuration = songs.reduce((sum, s) => sum + (s.duration || 0), 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="skeleton h-48 w-full rounded mb-6" />
        <RowSkeleton count={5} />
      </div>
    );
  }

  if (!album) return null;

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-b from-purple-800 to-[var(--bg-surface)] p-6">
        <div className="flex items-end gap-6">
          <ImageWithFallback
            src={album.coverImage}
            alt={album.title}
            className="w-56 h-56 rounded object-cover shadow-2xl"
            fallback={
              <div className="w-56 h-56 rounded bg-[var(--bg-highlight)] flex items-center justify-center shadow-2xl">
                <Disc3 size={64} className="text-[var(--text-secondary)]" />
              </div>
            }
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase font-bold tracking-wider mb-2">Album</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 truncate">{album.title}</h1>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">{album.artist?.name}</span>
              {album.releaseYear && <span>· {album.releaseYear}</span>}
              <span>· {songs.length} songs</span>
              <span>· {formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-xl mb-6"
        >
          <Play size={24} className="text-black ml-1" />
        </button>

        <div className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-3 py-2 text-xs text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-color)] mb-2">
          <span>#</span>
          <span>Title</span>
          <span className="hidden md:block">Artist</span>
          <span className="flex justify-end"><Clock size={14} /></span>
        </div>

        <div className="space-y-1">
          {songs.map((song, index) => (
            <div
              key={song._id}
              className="group grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-3 py-2 rounded-md items-center hover:bg-[var(--hover-bg-subtle)] transition-colors cursor-pointer"
              onClick={() => {
                dispatch(setQueue(songs));
                dispatch(setCurrentSong(song));
              }}
            >
              <div className="flex items-center justify-center">
                <span className="group-hover:hidden text-sm text-[var(--text-secondary)]">{index + 1}</span>
                <Play size={16} className="hidden group-hover:block text-[var(--text-primary)]" />
              </div>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded bg-[var(--bg-highlight)] flex items-center justify-center shrink-0">
                  <Music size={16} className="text-[var(--text-secondary)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] truncate hidden md:block">{song.artist?.name}</p>
              <div className="flex items-center justify-end">
                <span className="text-sm text-[var(--text-secondary)]">{formatDuration(song.duration)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
