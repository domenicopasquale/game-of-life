import { useMemo } from 'react';

const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  STORAGE_KEY: import.meta.env.MODE === 'production' ? 'game_of_life_' : 'game_of_life_dev_'
};

export const useConfig = () => {
  const config = useMemo(() => {
    return ENV;
  }, []);

  return config;
}; 