// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

const verifyAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Set loading to true when starting verification
      setIsLoading(true);

      // Verify token with backend
      const response = await api.get('/api/students/verify');
      
      // Make sure response contains valid student data
      if (response && response.success && response.data) {
        setStudent(response.data);
        localStorage.setItem('student', JSON.stringify(response.data));
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      // Clear invalid session
      localStorage.removeItem('token');
      localStorage.removeItem('student');
      setStudent(null);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    verifyAuth();
    
    // Set up token refresh or session monitoring if needed
    const checkAuthInterval = setInterval(verifyAuth, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(checkAuthInterval);
  }, []);

  const login = async (studentData, token) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('student', JSON.stringify(studentData));
      setStudent(studentData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/students/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('student');
      setStudent(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      student, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!student
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);