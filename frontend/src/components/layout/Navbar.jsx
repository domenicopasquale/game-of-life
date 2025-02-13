import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!token) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 shadow-sm
        ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/login"
              className={`text-lg sm:text-xl font-bold transition-colors
                ${isDark ? 'text-white hover:text-primary-400' : 'text-gray-900 hover:text-primary-600'}`}
            >
              Game of Life
            </Link>
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors
                ${isDark 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/dashboard"
            className="text-lg sm:text-xl font-bold text-gray-900 hover:text-primary-600 
              transition-colors dark:text-white truncate"
          >
            Game of Life
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-6">
              <Link
                to="/dashboard"
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive('/dashboard')
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                Games
              </Link>
              
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-gray-600 
                  hover:bg-gray-50 hover:text-gray-900 transition-colors
                  dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 
                dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 