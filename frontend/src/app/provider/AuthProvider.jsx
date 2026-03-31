import { createContext, useContext, useState } from 'react';
import { isTokenValid } from '@/shared/utils/tokenValidator.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('jwt');

    if (storedToken && storedUser && isTokenValid(storedToken)) {
      return JSON.parse(storedUser);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken && isTokenValid(storedToken)) {
      return storedToken;
    }
    return '';
  });

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('jwt', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
