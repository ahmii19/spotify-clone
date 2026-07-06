import api from '../api/axios';

export const getHistory = (params) => api.get('/history', { params });
export const addToHistory = (songId) => api.post('/history', { songId });
export const clearHistory = () => api.delete('/history');
export const getRecentlyPlayed = () => api.get('/history/recently-played');
