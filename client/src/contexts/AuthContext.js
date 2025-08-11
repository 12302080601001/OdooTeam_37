import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults and interceptors
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    // Add response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Check if it's a token expiration error
          if (error.response?.data?.error === 'Token expired. Please login again.') {
            console.log('Token expired, attempting refresh...');

            // Try to refresh token
            try {
              const refreshResult = await refreshToken();
              if (refreshResult.success) {
                // Retry the original request with new token
                originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                return axios(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }

          // If refresh failed or other 401 error, logout user
          console.log('Authentication failed, logging out...');
          logout();
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);

          // Only logout if it's not a network error
          if (error.response) {
            logout();
          } else {
            // Network error - keep user logged in but show warning
            console.warn('Network error during auth check, keeping user logged in');
            toast.warn('Connection issue detected. Please check your internet connection.');
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Registration successful!');
      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = (showMessage = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    if (showMessage) {
      toast.info('Logged out successfully');
    }
  };

  // Check if token is expired without making API call
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const refreshToken = async () => {
    try {
      // Don't include the old token in refresh request to avoid circular issues
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        return { success: false, error: 'No token to refresh' };
      }

      const response = await axios.post('/api/auth/refresh', {}, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      const { token: newToken } = response.data;

      setToken(newToken);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      console.log('Token refreshed successfully');
      return { success: true };
    } catch (error) {
      console.error('Token refresh failed:', error);

      // Don't automatically logout here - let the interceptor handle it
      return { success: false, error: error.response?.data?.error || 'Token refresh failed' };
    }
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const isTraveller = () => {
    return hasRole('traveller');
  };

  const isPlanner = () => {
    return hasRole('planner');
  };

  const isVendor = () => {
    return hasRole('vendor');
  };

  const canAccess = (requiredRoles) => {
    if (!user) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
    isAuthenticated,
    hasRole,
    isAdmin,
    isTraveller,
    isPlanner,
    isVendor,
    canAccess,
    isTokenExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
