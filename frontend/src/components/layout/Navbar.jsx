import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!token) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link 
              to="/login"
              className="flex items-center text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
            >
              Game of Life
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link 
            to="/dashboard"
            className="flex items-center text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
          >
            Game of Life
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive('/dashboard')
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              Games
            </Link>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 
                hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 