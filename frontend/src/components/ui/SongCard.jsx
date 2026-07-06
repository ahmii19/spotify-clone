import { memo, useState, useEffect, useRef } from 'react';
import { Play, Heart, Music } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSong, setQueue } from '../../redux/slices/playerSlice';
import { likeSong, unlikeSong, checkLiked } from '../../services/likeService';
import toast from 'react-hot-toast';

function Highlight({ text, query }) {
  if (!query?.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-green-500/30 text-inherit rounded-sm px-0.5">{part}</mark>
      : part
  );
}

const SongCard = memo(function SongCard({ song, songs, highlight }) {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const { currentSong } = useSelector((state) => state.player);
  const isActive = currentSong?._id === song?._id;
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!song?._id || fetchedRef.current) return;
    fetchedRef.current = true;
    checkLiked(song._id).then(({ data }) => setIsLiked(data.data.isLiked)).catch(() => {});
  }, [song?._id]);

  const handlePlay = () => {
    if (songs) {
      dispatch(setQueue(songs));
    }
    dispatch(setCurrentSong(song));
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      if (isLiked) {
        await unlikeSong(song._id);
        setIsLiked(false);
      } else {
        await likeSong(song._id);
        setIsLiked(true);
      }
    } catch {
      toast.error('Failed to update like');
    }
  };

  const formatDur = (seconds) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={handlePlay}
      className={`group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[40px_1fr_1fr_80px] gap-2 sm:gap-4 px-3 py-2 rounded-md items-center cursor-pointer transition-colors ${
        isActive ? 'bg-green-500/10 text-green-500' : 'hover:bg-[var(--hover-bg-subtle)]'
      }`}
    >
      <div className="relative flex items-center justify-center w-8 sm:w-auto">
        <span className="group-hover:hidden text-sm text-[var(--text-secondary)]">{isActive && <span className="text-green-500">♫</span>}</span>
        <Play size={16} className="hidden group-hover:block text-[var(--text-primary)]" />
      </div>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded bg-[var(--bg-highlight)] flex items-center justify-center flex-shrink-0 sm:hidden">
          <Music size={16} className="text-[var(--text-secondary)]" />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isActive ? 'text-green-500' : ''}`}>
            <Highlight text={song?.title || ''} query={highlight} />
          </p>
          <p className="text-xs text-[var(--text-secondary)] truncate">
            <Highlight text={song?.artist?.name || ''} query={highlight} />
          </p>
        </div>
      </div>
      <p className="text-sm text-[var(--text-secondary)] truncate hidden sm:block">
        {song?.album?.title}
      </p>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleLike}
          className={`opacity-0 group-hover:opacity-100 transition ${
            isLiked ? 'text-green-500 opacity-100' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        <span className="text-sm text-[var(--text-secondary)]">{formatDur(song?.duration)}</span>
      </div>
    </div>
  );
});

export default SongCard;
