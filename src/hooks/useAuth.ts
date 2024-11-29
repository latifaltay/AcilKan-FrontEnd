import { useState, useCallback } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    return {
      accessToken: token,
      user: userStr ? JSON.parse(userStr) : null,
    };
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/AppUser/Login', {
        email,
        password
      });

      const { accessToken, refreshToken } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Parse JWT token to get user info
      const base64Url = accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const tokenData = JSON.parse(jsonPayload);
      
      // Create user object from token claims
      const user: User = {
        id: tokenData.sub,
        name: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        email: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
      };

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));

      // Update auth state
      setAuthState({
        accessToken,
        user
      });

      // Configure axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      return { accessToken, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setAuthState({ accessToken: null, user: null });
  }, []);

  const isAuthenticated = Boolean(authState.accessToken);

  return {
    user: authState.user,
    token: authState.accessToken,
    isAuthenticated,
    login,
    logout,
  };
};