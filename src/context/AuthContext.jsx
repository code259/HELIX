import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('helix_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, password, role = 'user') => {
    if (role === 'admin') {
      const adminUser = import.meta.env.VITE_ADMIN_USERNAME;
      const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;

      if (username === adminUser && password === adminPass) {
        const userData = { username, role: 'admin' };
        setUser(userData);
        localStorage.setItem('helix_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: 'Invalid admin credentials' };
    } else {
      const userData = { username, role: 'user' };
      setUser(userData);
      localStorage.setItem('helix_user', JSON.stringify(userData));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('helix_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
