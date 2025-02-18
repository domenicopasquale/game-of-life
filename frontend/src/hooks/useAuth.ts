import { useCallback } from 'react';
import { useGraphQL } from './useGraphQL';
import { useConfig } from './useConfig';
import { User, AuthResponse } from '../types/game';

interface UseAuthReturn {
  isAuthenticated: () => boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  getToken: () => string | null;
}

export const useAuth = (): UseAuthReturn => {
  const { execute } = useGraphQL();
  const { STORAGE_KEY } = useConfig();

  const getToken = useCallback((): string | null => {
    return localStorage.getItem(`${STORAGE_KEY}token`);
  }, [STORAGE_KEY]);

  const setToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem(`${STORAGE_KEY}token`, token);
    } else {
      localStorage.removeItem(`${STORAGE_KEY}token`);
    }
  }, [STORAGE_KEY]);

  const isAuthenticated = useCallback((): boolean => {
    return !!getToken();
  }, [getToken]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const data = await execute<{ signInUser: AuthResponse }>(`
      mutation SignInUser($email: String!, $password: String!) {
        signInUser(input: { email: $email, password: $password }) {
          token
          user {
            id
            email
          }
        }
      }
    `, { email, password });

    if (data?.signInUser?.token) {
      setToken(data.signInUser.token);
      return data.signInUser.user;
    }
    throw new Error('Login failed');
  }, [execute, setToken]);

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  return {
    isAuthenticated,
    login,
    logout,
    getToken
  };
}; 