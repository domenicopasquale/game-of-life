import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { darkTheme, lightTheme } from '../../utils/theme';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  if (!token) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 ${theme.shadow.sm} ${theme.background.secondary}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/login"
              className={`text-lg sm:text-xl font-bold transition-colors ${theme.text.primary}`}
            >
              <img 
                src={isDark ? "/game-of-life.svg" : "/game-of-life-light.svg"}
                alt="Game of Life" 
                className="h-8 w-auto"
              />
            </Link>
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme.button.ghost}`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${theme.shadow.sm} ${theme.background.secondary}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/dashboard"
            className={`text-lg sm:text-xl font-bold transition-colors ${theme.text.primary}`}
          >
            <img 
              src={isDark ? "/game-of-life.svg" : "/game-of-life-light.svg"}
              alt="Game of Life" 
              className="h-8 w-auto"
            />
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive('/dashboard')
                  ? `${theme.background.tertiary} ${theme.text.primary}`
                  : theme.button.ghost
                }`}
            >
              Games
            </Link>
            
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${theme.button.ghost}`}
            >
              Logout
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme.button.ghost}`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 