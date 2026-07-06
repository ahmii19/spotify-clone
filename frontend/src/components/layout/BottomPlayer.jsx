import { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1,
  Volume2, Volume1, VolumeX, Music, ListMusic,
} from 'lucide-react';
import {
  togglePlay, setVolume, setProgress, setDuration, setBuffered,
  nextSong, prevSong, toggleShuffle, setRepeat,
} from '../../redux/slices/playerSlice';
import { formatDuration } from '../../utils/formatters';
import { addToHistory } from '../../services/historyService';
import QueueDrawer from './QueueDrawer';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const BASE_URL = API_URL.replace('/api', '');

export default function BottomPlayer() {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, volume, progress, duration, buffered, shuffle, repeat, queue } = useSelector(
    (state) => state.player
  );
  const audioRef = useRef(null);
  const [localVolume, setLocalVolume] = useState(volume);
  const [showVolume, setShowVolume] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  const audioSrc = currentSong?.audioUrl
    ? currentSong.audioUrl.startsWith('http')
      ? currentSong.audioUrl
      : `${BASE_URL}${currentSong.audioUrl}`
    : '';

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && audioSrc) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = localVolume;
    }
  }, [localVolume]);

  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      dispatch(setProgress(audioRef.current.currentTime));
    }
  }, [dispatch]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      dispatch(setDuration(audioRef.current.duration));
    }
  }, [dispatch]);

  const handleProgress = useCallback(() => {
    if (audioRef.current && audioRef.current.buffered.length > 0) {
      const bufferedEnd = audioRef.current.buffered.end(audioRef.current.buffered.length - 1);
      dispatch(setBuffered(bufferedEnd));
    }
  }, [dispatch]);

  const handleEnded = useCallback(() => {
    if (repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      dispatch(nextSong());
    }
  }, [dispatch, repeat]);

  const handleSongEndHistory = useCallback(async () => {
    if (currentSong?._id) {
      try { await addToHistory(currentSong._id); } catch {}
    }
  }, [currentSong]);

  useEffect(() => {
    if (currentSong?._id && isPlaying) {
      handleSongEndHistory();
    }
  }, [currentSong?._id, isPlaying, handleSongEndHistory]);

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      dispatch(setProgress(value));
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setLocalVolume(value);
    dispatch(setVolume(value));
  };

  const toggleMute = () => {
    if (localVolume > 0) {
      setLocalVolume(0);
      dispatch(setVolume(0));
    } else {
      setLocalVolume(volume || 0.7);
      dispatch(setVolume(volume || 0.7));
    }
  };

  const togglePlayHandler = () => dispatch(togglePlay());

  const handleNext = () => {
    if (queue.length <= 1) return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    dispatch(nextSong());
  };

  const handlePrev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      dispatch(prevSong());
    }
  };

  const handleRepeat = () => {
    const modes = { off: 'all', all: 'one', one: 'off' };
    dispatch(setRepeat(modes[repeat]));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          dispatch(togglePlay());
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, (audioRef.current.currentTime - 5));
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.currentTime = Math.min(duration, (audioRef.current.currentTime + 5));
          }
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, duration]);

  if (!currentSong) return null;

  const VolumeIcon = localVolume === 0 ? VolumeX : localVolume < 0.5 ? Volume1 : Volume2;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-color)] px-2 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-2 sm:gap-3 w-[30%] min-w-[40px] sm:min-w-[180px] max-w-[200px]">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[var(--bg-highlight)] flex items-center justify-center flex-shrink-0">
          <Music size={18} className="text-[var(--text-secondary)]" />
        </div>
        <div className="min-w-0 hidden sm:block">
          <p className="text-sm font-medium truncate text-[var(--text-primary)]">{currentSong.title}</p>
          <p className="text-xs text-[var(--text-secondary)] truncate">
            {currentSong.artist?.name || 'Unknown Artist'}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 flex-1 max-w-[600px]">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => dispatch(toggleShuffle())}
            className={`transition hidden sm:block ${shuffle ? 'text-green-500' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            aria-label={`Shuffle ${shuffle ? 'on' : 'off'}`}
          >
            <Shuffle size={18} />
          </button>
          <button onClick={handlePrev} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition" aria-label="Previous">
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlayHandler}
            className="w-8 h-8 bg-[var(--play-button-bg)] rounded-full flex items-center justify-center hover:scale-105 transition"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} className="text-[var(--play-button-icon)]" /> : <Play size={16} className="text-[var(--play-button-icon)] ml-0.5" />}
          </button>
          <button onClick={handleNext} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition" aria-label="Next">
            <SkipForward size={18} />
          </button>
          <button
            onClick={handleRepeat}
            className={`transition hidden sm:block ${repeat !== 'off' ? 'text-green-500' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            aria-label={`Repeat ${repeat === 'one' ? 'one' : repeat === 'all' ? 'all' : 'off'}`}
          >
            {repeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-[500px]">
          <span className="text-xs text-[var(--text-secondary)] w-8 sm:w-10 text-right tabular-nums">
            {formatDuration(progress)}
          </span>
          <div className="relative flex-1 h-1">
            <div className="absolute inset-0 rounded-full bg-[var(--bg-highlight)]" />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--text-subdued)]"
              style={{ width: `${bufferedPercent}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={progress}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-1 accent-green-500 cursor-pointer opacity-0 z-10"
              aria-label="Seek"
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-green-500 pointer-events-none"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow pointer-events-none"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>
          <span className="text-xs text-[var(--text-secondary)] w-8 sm:w-10 tabular-nums">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-[30%] min-w-[40px] sm:min-w-[180px] justify-end">
        <button
          onClick={() => setQueueOpen(true)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition relative"
          aria-label="Open queue"
        >
          <ListMusic size={18} />
          {queue.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full text-[8px] font-bold text-black flex items-center justify-center">
              {queue.length}
            </span>
          )}
        </button>
        <div className="items-center gap-2 hidden sm:flex">
          <button
            onClick={toggleMute}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            aria-label={localVolume === 0 ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon size={18} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={localVolume}
            onChange={handleVolumeChange}
            className="w-20 h-1 accent-green-500 cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>

      <QueueDrawer open={queueOpen} onClose={() => setQueueOpen(false)} />
    </footer>
  );
}
