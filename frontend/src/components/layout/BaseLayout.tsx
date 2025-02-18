import { ReactNode } from 'react';
import Navbar from "./Navbar";
import { useTheme } from '../../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../../utils/theme';

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <div className={`min-h-screen ${theme.background.primary} transition-colors duration-200`}>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default BaseLayout; 