import api from '../api/axios';

export const getArtists = (params) => api.get('/artists', { params });
export const getArtist = (id) => api.get(`/artists/${id}`);
export const createArtist = (data) => api.post('/artists', data);
export const updateArtist = (id, data) => api.put(`/artists/${id}`, data);
export const deleteArtist = (id) => api.delete(`/artists/${id}`);
