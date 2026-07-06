import api from '../api/axios';

export const getUsers = (params) => api.get('/users', { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateProfile = (data) => api.put('/users/profile/me', data);
export const changePassword = (data) => api.put('/users/password/me', data);
export const toggleBlockUser = (id) => api.put(`/users/${id}/block`);
