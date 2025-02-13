import { useCallback } from 'react';
import { useConfig } from './useConfig';

export const useGraphQL = () => {
  const { API_URL } = useConfig();

  const execute = useCallback(async (query, variables = {}) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
      }

      const { data, errors } = await response.json();
      
      if (errors) {
        throw new Error(errors[0].message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }, [API_URL]);

  return { execute };
}; 