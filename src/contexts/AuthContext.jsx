import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/interceptor';
import { refreshAccessToken } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          try {
            const profileResponse = await api.get('/user/profile/');
            setUser(profileResponse.data);
          } catch (error) {
            try {
              await handleTokenRefresh();
              const profileResponse = await api.get('/user/profile/');
              setUser(profileResponse.data);
            } catch (refreshError) {
              console.error('Token refresh failed during init:', refreshError);
              logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setIsLoading(true);

      const response = await api.post('/user/auth/login/', { username, password });
      const { access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      const profileResponse = await api.get('/user/profile/');
      setUser(profileResponse.data);

      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/');
  };

  const handleTokenRefresh = async () => {
    try {
      const newAccess = await refreshAccessToken();
      localStorage.setItem('accessToken', newAccess);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken: handleTokenRefresh,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
