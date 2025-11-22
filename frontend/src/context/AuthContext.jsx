// frontend/src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage to keep user logged in on refresh
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('team');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    // Set the axios default authorization header when the user state changes
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setIsAuthLoading(false); // Finished checking auth status
  }, [user]);

  const login = async (username, password) => {
    const team = await authService.login({ username, password });
    setUser(team);
  };

  const register = async (username, password) => {
    const team = await authService.register({ username, password });
    setUser(team);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;