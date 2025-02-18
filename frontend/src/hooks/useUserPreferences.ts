import { useState, useEffect } from 'react';

interface UserPreferences {
  isDark: boolean;
  cellSize: number;
}

interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

export const useUserPreferences = (): UseUserPreferencesReturn => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : { isDark: false, cellSize: 20 };
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  return {
    preferences,
    setPreferences
  };
}; 