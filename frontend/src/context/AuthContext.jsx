import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { getToken, setToken, clearAll, KEYS } from '../utils/storage';

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken(KEYS.TOKEN);
    if (savedToken) {
      const decoded = decodeToken(savedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setTokenState(savedToken);
        const savedUser = getToken(KEYS.USER);
        setUser(savedUser ? JSON.parse(savedUser) : decoded);
      } else {
        clearAll();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const newToken = data.token;
    const userData = {
      id: data.id, name: data.name, email: data.email,
      role: data.role, specialty: data.specialty, profileImage: data.profileImage,
    };
    setToken(KEYS.TOKEN, newToken);
    setToken(KEYS.USER, JSON.stringify(userData));
    setTokenState(newToken);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    const newToken = data.token;
    const userData = {
      id: data.id, name: data.name, email: data.email,
      role: data.role, specialty: data.specialty, profileImage: data.profileImage,
    };
    setToken(KEYS.TOKEN, newToken);
    setToken(KEYS.USER, JSON.stringify(userData));
    setTokenState(newToken);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    clearAll();
    setTokenState(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const updateUser = useCallback((data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      setToken(KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
