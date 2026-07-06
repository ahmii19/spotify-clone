import { createContext, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setAccessToken, setLoading, logout } from '../redux/slices/authSlice';
import { store } from '../redux/store';
import { getProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(setAccessToken(token));

      const loadUser = async () => {
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

      loadUser();
    } else {
      dispatch(logout());
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
