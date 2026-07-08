import { createContext, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setAccessToken, setLoading, logout } from '../redux/slices/authSlice';
import { store } from '../redux/store';
import { getProfile } from '../services/authService';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AuthContext = createContext(null);

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      console.log('[AUTH] initializeAuth called. Has stored token:', !!storedToken);

      if (!storedToken) {
        console.log('[AUTH] No stored token, logging out');
        dispatch(logout());
        dispatch(setLoading(false));
        return;
      }

      const expired = isTokenExpired(storedToken);
      console.log('[AUTH] Token expired:', expired);

      if (expired) {
        try {
          console.log('[AUTH] Attempting refresh...');
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
          if (data.success) {
            const newToken = data.data.accessToken;
            console.log('[AUTH] Refresh succeeded, new token stored');
            localStorage.setItem('accessToken', newToken);
            dispatch(setAccessToken(newToken));
          }
        } catch (err) {
          console.warn('[AUTH] Refresh failed, using stored token as-is:', err.response?.data?.message || err.message);
          dispatch(setAccessToken(storedToken));
        }
      } else {
        console.log('[AUTH] Token valid, setting in store');
        dispatch(setAccessToken(storedToken));
      }

      try {
        console.log('[AUTH] Fetching profile...');
        const { data } = await getProfile();
        if (data.success) {
          const currentToken = store.getState().auth.accessToken;
          console.log('[AUTH] Profile fetched, user role:', data.data.user?.role);
          dispatch(setCredentials({ user: data.data.user, accessToken: currentToken }));
        } else {
          console.warn('[AUTH] Profile fetch failed (success false)');
          localStorage.removeItem('accessToken');
          dispatch(logout());
        }
      } catch (err) {
        console.error('[AUTH] Profile fetch error:', err.response?.data?.message || err.message);
        localStorage.removeItem('accessToken');
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
