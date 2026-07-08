import axios from 'axios';
import { store } from '../redux/store';
import { logout, setAccessToken } from '../redux/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Accept': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[AXIOS] No token in store for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 429) {
      return Promise.reject(error);
    }

    const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh');
    const isLoginEndpoint = originalRequest?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshEndpoint && !isLoginEndpoint) {
      console.warn('[AXIOS] 401 on', originalRequest.url, '- triggering token refresh');
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('[AXIOS] Attempting token refresh...');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        if (data.success) {
          console.log('[AXIOS] Token refresh succeeded');
          store.dispatch(setAccessToken(data.data.accessToken));
          processQueue(null, data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
        console.warn('[AXIOS] Token refresh failed - success false');
        processQueue(new Error('Refresh failed'));
        store.dispatch(logout());
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('[AXIOS] Token refresh error:', refreshError.response?.data?.message || refreshError.message);
        processQueue(refreshError);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const refreshAccessToken = async () => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
    if (data.success) {
      store.dispatch(setAccessToken(data.data.accessToken));
      return data.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
};

export default api;
