import { useSelector, useDispatch } from 'react-redux';
import { X, Music, ChevronUp, GripVertical, Trash2 } from 'lucide-react';
import { removeFromQueue, setCurrentSong } from '../../redux/slices/playerSlice';
import { formatDuration } from '../../utils/formatters';

export default function QueueDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const { queue, currentSong } = useSelector((state) => state.player);

  const handleSongClick = (song) => {
    dispatch(setCurrentSong(song));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[var(--bg-surface)] h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="font-bold text-lg">Queue</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--hover-bg)] transition" aria-label="Close queue">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] gap-3">
              <Music size={48} />
              <p className="text-sm">Queue is empty</p>
              <p className="text-xs">Play a song to start</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              <p className="text-xs text-[var(--text-secondary)] font-medium px-2 pb-2 pt-1 uppercase tracking-wider">
                Up Next &middot; {queue.length} song{queue.length !== 1 ? 's' : ''}
              </p>
              {queue.map((song, index) => {
                const isCurrent = song._id === currentSong?._id;
                return (
                  <div
                    key={`${song._id}-${index}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition cursor-pointer ${
                      isCurrent
                        ? 'bg-green-500/10 text-green-500'
                        : 'hover:bg-[var(--hover-bg)] text-[var(--text-primary)]'
                    }`}
                    onClick={() => handleSongClick(song)}
                  >
                    <button
                      className="cursor-grab active:cursor-grabbing text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Drag to reorder"
                    >
                      <GripVertical size={14} />
                    </button>
                    <div className="w-8 h-8 rounded bg-[var(--bg-highlight)] flex items-center justify-center flex-shrink-0">
                      <Music size={14} className="text-[var(--text-secondary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrent ? 'text-green-500' : ''}`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {song.artist?.name || 'Unknown'}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                      {formatDuration(song.duration)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeFromQueue(song._id));
                      }}
                      className="p-1 text-[var(--text-secondary)] hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                      aria-label="Remove from queue"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
