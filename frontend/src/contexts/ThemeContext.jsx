import { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from '../hooks/useUserPreferences';

const ThemeContext = createContext();

const commonStyles = {
  input: `block w-full rounded-lg shadow-sm px-4 py-2.5 sm:text-sm
    transition-colors duration-75 border
    focus:border-primary-500 focus:ring-1 focus:ring-primary-500`,
  inputLight: 'bg-white border-gray-300 text-gray-800 placeholder-gray-500',
  inputDark: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
  label: 'block text-sm font-medium mb-1',
  labelLight: 'text-gray-700',
  labelDark: 'text-gray-200',
};

export function ThemeProvider({ children }) {
  const { isDarkMode, getCellSize, setPreference } = useUserPreferences();
  const [isDark, setIsDark] = useState(isDarkMode);
  const [cellSize, setCellSize] = useState(getCellSize);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    setPreference('theme', isDark);
  }, [isDark, setPreference]);

  useEffect(() => {
    setPreference('cellSize', cellSize);
  }, [cellSize, setPreference]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme,
      cellSize,
      setCellSize,
      styles: commonStyles
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 