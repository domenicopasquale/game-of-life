import { useMemo } from 'react';

const ENV = {
  development: {
    API_URL: 'http://localhost:3001',
    STORAGE_KEY: 'game_of_life_dev_'
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || 'https://api.gameoflife.com',
    STORAGE_KEY: 'game_of_life_'
  }
};

export const useConfig = () => {
  const config = useMemo(() => {
    const environment = import.meta.env.MODE || 'development';
    return ENV[environment];
  }, []);

  return config;
}; 