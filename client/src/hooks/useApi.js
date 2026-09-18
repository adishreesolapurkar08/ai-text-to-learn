import { useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

export function useApi() {
  const { token, isAuthenticated } = useAuth();

  const api = useCallback(
    async (method, path, data) => {
      if (!isAuthenticated || !token) {
        throw new Error('Not authenticated');
      }

      const config = {
        method,
        url: `${API_BASE_URL}${path}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      if (data !== undefined) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    },
    [isAuthenticated, token]
  );

  const get = useCallback((path) => api('GET', path), [api]);
  const post = useCallback((path, data) => api('POST', path, data), [api]);

  return { get, post, api };
}
