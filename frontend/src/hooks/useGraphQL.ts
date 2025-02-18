import { useCallback } from 'react';
import { useConfig } from './useConfig';
import { DocumentNode } from 'graphql';

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: {
      code: string;
      detailed_message?: string;
    };
  }>;
}

interface UseGraphQLReturn {
  execute: <T = any>(query: string | DocumentNode, variables?: Record<string, any>) => Promise<T>;
}

export const useGraphQL = (): UseGraphQLReturn => {
  const { API_URL } = useConfig();

  const execute = useCallback(async <T = any>(query: string | DocumentNode, variables: Record<string, any> = {}) => {
    const token = localStorage.getItem('token');
    
    console.log('GraphQL Request:', {
      query: query.toString(),
      variables
    });
    
    try {
      const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          query,
          variables
        }),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
      }

      const { data, errors }: GraphQLResponse<T> = await response.json();
      
      if (errors) {
        throw new Error(errors[0].message);
      }

      return data as T;
    } catch (error) {
      throw error;
    }
  }, [API_URL]);

  return { execute };
}; 