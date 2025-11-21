// ============================================================================
// AuthContext.jsx - Authentication Context Provider
// ============================================================================
import React, { createContext, useState, useContext, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create authenticated fetch wrapper
const createAuthFetch = (token) => ({
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
      throw new Error('Unauthorized');
    }
    return response.json();
  },
  post: async (url, data = null, config = {}) => {
    const response = await fetch(
      `${API_BASE_URL}${url}${config.params ? '?' + new URLSearchParams(config.params) : ''}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: data ? JSON.stringify(data) : null
      }
    );
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
      throw new Error('Unauthorized');
    }
    return response.json();
  }
});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        await fetchUserData(data.access_token);
        return { success: true };
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Invalid credentials';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Login failed. Please check if the backend server is running.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        // Auto-login after registration
        const loginResult = await login(userData.username, userData.password);
        return loginResult;
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Registration failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Registration failed. Please check if the backend server is running.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Get authenticated fetch instance
  const getAuthFetch = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return createAuthFetch(token);
  };

  const value = {
    isAuthenticated,
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    getAuthFetch,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;