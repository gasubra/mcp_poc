import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return useStandaloneAuth();
  }
  return context;
};

const useStandaloneAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await authService.checkAuthStatus();
        setIsAuthenticated(authStatus.isAuthenticated);
        if (authStatus.isAuthenticated) {
          setUser(authStatus.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  return { user, isAuthenticated, isLoading, login, logout };
};

export const AuthProvider = ({ children }) => {
  const auth = useStandaloneAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};