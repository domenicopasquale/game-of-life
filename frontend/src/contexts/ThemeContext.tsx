import React, { createContext, useContext, ReactNode } from 'react';
import { useUserPreferences } from '../hooks/useUserPreferences';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  cellSize: number;
  setCellSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { preferences, setPreferences } = useUserPreferences();

  const toggleTheme = () => {
    setPreferences(prev => ({
      ...prev,
      isDark: !prev.isDark
    }));
  };

  const setCellSize = (size: number) => {
    setPreferences(prev => ({
      ...prev,
      cellSize: size
    }));
  };

  const value = {
    isDark: preferences.isDark,
    toggleTheme,
    cellSize: preferences.cellSize,
    setCellSize
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 