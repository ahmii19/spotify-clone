import api from '../api/axios';

export const getStats = () => api.get('/analytics');
export const getAllPlaylists = (params) => api.get('/playlists/all', { params });
