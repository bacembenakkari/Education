  import axios from 'axios';
  import React, { createContext, useCallback, useEffect, useState } from 'react';
  import { jwtDecode } from 'jwt-decode';

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export const AuthContext = createContext();

  const getUserIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.userId || decoded.sub || decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const saveUserData = (data) => {
    if (data.token) localStorage.setItem('token', data.token);
    if(data.user)  localStorage.setItem('user',data.user)
    if (data.role) localStorage.setItem('role', data.role);
  };

  export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const updateUserState = (token,user, roleData) => {
      if (token) {
        const userId = getUserIdFromToken(token);
        setToken(token);
        setUser(user);
        setRole(roleData);
        setIsAuthenticated(true);
        saveUserData({ token,user, role: roleData });
      }
    };

    const login = async (email, password) => {
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token, role,user } = response.data;

        if (!token) {
          throw new Error('Token not received');
        }

        updateUserState(token,user, role);
        setError(null);

        return response.data;

      } catch (error) {
        console.error('Login error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        const errorMessage = error.response?.data?.message || 'Login failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    };

    const signup = async ({ firstName, lastName, email, password }) => {
      try {
        const response = await api.post('/auth/signup', {
          firstName,
          lastName,
          email,
          password,
          role: "STUDENT"
        });

        const { token, role } = response.data;

        if (!token) {
          throw new Error('Token not received');
        }

        updateUserState(token, role);
        setError(null);
        return response.data;
      } catch (error) {
        console.error('Signup error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        const errorMessage = error.response?.data?.message || 'Signup failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    };

    const checkAuth = useCallback(async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/verify-token');
        const { role } = response.data;

        if (!role) {
          throw new Error('Invalid token verification response');
        }

        const userId = getUserIdFromToken(storedToken);
        setToken(storedToken);
        setRole(role);
        setUser({ id: userId });
        setIsAuthenticated(true);

      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    const logout = () => {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      setRole(null);
      setError(null);
      localStorage.clear();
    };

    // Function to get current user ID
    const getCurrentUserId = () => {
      const currentToken = localStorage.getItem('token');
      return currentToken ? getUserIdFromToken(currentToken) : null;
    };

    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          user,
          token,
          role,
          error,
          isLoading,
          login,
          signup,
          logout,
          checkAuth,
          getCurrentUserId // Exposing the function to get user ID
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  export default AuthProvider;