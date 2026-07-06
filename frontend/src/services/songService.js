import api from '../api/axios';

export const getSongs = (params) => api.get('/songs', { params });
export const getSong = (id) => api.get(`/songs/${id}`);
export const createSong = (data, onUploadProgress) => api.post('/songs', data, { onUploadProgress });
export const updateSong = (id, data) => api.put(`/songs/${id}`, data);
export const deleteSong = (id) => api.delete(`/songs/${id}`);
