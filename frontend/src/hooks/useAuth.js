import { useCallback } from 'react';
import { useGraphQL } from './useGraphQL';
import { useConfig } from './useConfig';

export const useAuth = () => {
  const { execute } = useGraphQL();
  const { STORAGE_KEY } = useConfig();

  const getToken = useCallback(() => {
    return localStorage.getItem(`${STORAGE_KEY}token`);
  }, [STORAGE_KEY]);

  const setToken = useCallback((token) => {
    if (token) {
      localStorage.setItem(`${STORAGE_KEY}token`, token);
    } else {
      localStorage.removeItem(`${STORAGE_KEY}token`);
    }
  }, [STORAGE_KEY]);

  const isAuthenticated = useCallback(() => {
    return !!getToken();
  }, [getToken]);

  const login = useCallback(async (email, password) => {
    const data = await execute(`
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