import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: parseFloat(localStorage.getItem('playerVolume')) || 0.7,
  progress: 0,
  duration: 0,
  buffered: 0,
  shuffle: false,
  repeat: 'off',
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action) => {
      state.queue = state.queue.filter((s) => s._id !== action.payload);
    },
    playNext: (state, action) => {
      const currentIndex = state.queue.findIndex(
        (s) => s._id === state.currentSong?._id
      );
      state.queue.splice(currentIndex + 1, 0, action.payload);
    },
    reorderQueue: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.queue.splice(fromIndex, 1);
      state.queue.splice(toIndex, 0, moved);
    },
    playSong: (state) => {
      state.isPlaying = true;
    },
    pauseSong: (state) => {
      state.isPlaying = false;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
      localStorage.setItem('playerVolume', action.payload);
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setBuffered: (state, action) => {
      state.buffered = action.payload;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    setRepeat: (state, action) => {
      state.repeat = action.payload;
    },
    nextSong: (state) => {
      if (state.queue.length === 0) return;
      const currentIndex = state.queue.findIndex(
        (s) => s._id === state.currentSong?._id
      );
      let nextIndex;
      if (state.shuffle) {
        let idx;
        do {
          idx = Math.floor(Math.random() * state.queue.length);
        } while (idx === currentIndex && state.queue.length > 1);
        nextIndex = idx;
      } else {
        nextIndex = (currentIndex + 1) % state.queue.length;
      }
      state.currentSong = state.queue[nextIndex];
      state.progress = 0;
    },
    prevSong: (state) => {
      if (state.queue.length === 0) return;
      const currentIndex = state.queue.findIndex(
        (s) => s._id === state.currentSong?._id
      );
      const prevIndex = (currentIndex - 1 + state.queue.length) % state.queue.length;
      state.currentSong = state.queue[prevIndex];
      state.progress = 0;
    },
    clearPlayer: (state) => {
      state.currentSong = null;
      state.queue = [];
      state.isPlaying = false;
      state.progress = 0;
      state.duration = 0;
      state.buffered = 0;
    },
  },
});

export const {
  setCurrentSong, setQueue, addToQueue, removeFromQueue, playNext, reorderQueue,
  playSong, pauseSong, togglePlay,
  setVolume, setProgress, setDuration, setBuffered, toggleShuffle, setRepeat,
  nextSong, prevSong, clearPlayer,
} = playerSlice.actions;
export default playerSlice.reducer;
