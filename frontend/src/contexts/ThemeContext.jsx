import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Aggiungiamo delle classi comuni per gli input
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
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [cellColor, setCellColor] = useState(() => {
    return localStorage.getItem('cellColor') || '#1f2937'; // default gray-800
  });
  
  const [cellSize, setCellSize] = useState(() => {
    return parseInt(localStorage.getItem('cellSize')) || 15;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('cellColor', cellColor);
  }, [cellColor]);

  useEffect(() => {
    localStorage.setItem('cellSize', cellSize.toString());
  }, [cellSize]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme,
      cellColor,
      setCellColor,
      cellSize,
      setCellSize,
      styles: commonStyles
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 