import api from '../api/axios';

export const getAlbums = (params) => api.get('/albums', { params });
export const getAlbum = (id) => api.get(`/albums/${id}`);
export const createAlbum = (data) => api.post('/albums', data);
export const updateAlbum = (id, data) => api.put(`/albums/${id}`, data);
export const deleteAlbum = (id) => api.delete(`/albums/${id}`);
