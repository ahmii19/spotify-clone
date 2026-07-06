import api from '../api/axios';

export const getPlaylists = (params) => api.get('/playlists', { params });
export const getPlaylist = (id) => api.get(`/playlists/${id}`);
export const createPlaylist = (data) => api.post('/playlists', data);
export const updatePlaylist = (id, data) => api.put(`/playlists/${id}`, data);
export const deletePlaylist = (id) => api.delete(`/playlists/${id}`);
export const addSongToPlaylist = (id, songId) => api.post(`/playlists/${id}/songs`, { songId });
export const removeSongFromPlaylist = (id, songId) => api.delete(`/playlists/${id}/songs`, { data: { songId } });
