import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../../utils/theme';
import Spinner from '../common/Spinner';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setIsChecking(false);
          return;
        }

        // Qui potresti aggiungere una chiamata per verificare il token se necessario
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isChecking) {
    return <Spinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 