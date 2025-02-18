interface Config {
  API_URL: string;
  STORAGE_KEY: string;
}

export const useConfig = (): Config => {
  return {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    STORAGE_KEY: 'gameoflife_'
  };
}; 