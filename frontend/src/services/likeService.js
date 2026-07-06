import api from '../api/axios';

export const getLikedSongs = () => api.get('/likes');
export const likeSong = (songId) => api.post('/likes', { songId });
export const unlikeSong = (songId) => api.delete(`/likes/${songId}`);
export const checkLiked = (songId) => api.get(`/likes/${songId}/check`);
