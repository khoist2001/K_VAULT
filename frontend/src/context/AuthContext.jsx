// =============================================================
// K-VAULT - Auth Context (Quản lý xác thực)
// =============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng trong AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra user đã đăng nhập khi load app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('kvault_user');
        const savedToken = localStorage.getItem('kvault_token');

        if (savedUser && savedToken) {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data.user);
          }
        }
      } catch (error) {
        localStorage.removeItem('kvault_user');
        localStorage.removeItem('kvault_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Đăng ký
  const register = useCallback(async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    if (res.data.success) {
      const { user: userData, token } = res.data.data;
      setUser(userData);
      localStorage.setItem('kvault_user', JSON.stringify(userData));
      localStorage.setItem('kvault_token', token);
      toast.success(res.data.message);
    }
    return res.data;
  }, []);

  // Đăng nhập
  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { user: userData, token } = res.data.data;
      setUser(userData);
      localStorage.setItem('kvault_user', JSON.stringify(userData));
      localStorage.setItem('kvault_token', token);
      toast.success(res.data.message);
    }
    return res.data;
  }, []);

  // Đăng xuất
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Vẫn đăng xuất dù lỗi API
    }
    setUser(null);
    localStorage.removeItem('kvault_user');
    localStorage.removeItem('kvault_token');
    toast.success('Đã đăng xuất thành công!');
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
