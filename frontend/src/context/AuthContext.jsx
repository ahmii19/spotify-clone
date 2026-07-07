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

      if (!storedToken) {
        dispatch(logout());
        dispatch(setLoading(false));
        return;
      }

      if (isTokenExpired(storedToken)) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
          if (data.success) {
            const newToken = data.data.accessToken;
            localStorage.setItem('accessToken', newToken);
            dispatch(setAccessToken(newToken));
          }
        } catch {
          dispatch(setAccessToken(storedToken));
        }
      } else {
        dispatch(setAccessToken(storedToken));
      }

      try {
        const { data } = await getProfile();
        if (data.success) {
          const currentToken = store.getState().auth.accessToken;
          dispatch(setCredentials({ user: data.data.user, accessToken: currentToken }));
        } else {
          localStorage.removeItem('accessToken');
          dispatch(logout());
        }
      } catch {
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
