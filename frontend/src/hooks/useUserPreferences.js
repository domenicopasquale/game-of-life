import { useCallback } from 'react';
import { useConfig } from './useConfig';

export const useUserPreferences = () => {
  const { STORAGE_KEY } = useConfig();

  const getPreference = useCallback((key, defaultValue) => {
    const value = localStorage.getItem(`${STORAGE_KEY}pref_${key}`);
    return value !== null ? JSON.parse(value) : defaultValue;
  }, [STORAGE_KEY]);

  const setPreference = useCallback((key, value) => {
    localStorage.setItem(`${STORAGE_KEY}pref_${key}`, JSON.stringify(value));
  }, [STORAGE_KEY]);

  const isDarkMode = useCallback(() => {
    const saved = getPreference('theme');
    return saved ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [getPreference]);

  const getCellSize = useCallback(() => {
    return getPreference('cellSize', 15);
  }, [getPreference]);

  return {
    isDarkMode,
    getCellSize,
    getPreference,
    setPreference
  };
}; 