import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    setUser({ ...res.data.user, role: 'user' });
  };

  const loginAdmin = async (email, password) => {
    const res = await api.post('/api/auth/admin/login', { email, password });
    setUser({ ...res.data.admin, role: 'admin' });
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    setUser({ ...res.data.user, role: 'user' });
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAdmin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
