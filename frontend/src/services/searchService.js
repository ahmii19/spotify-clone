import api from '../api/axios';

export const searchAll = (params) => api.get('/search', { params });
