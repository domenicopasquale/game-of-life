import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  linkText: string;
  linkTo: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  linkText, 
  linkTo 
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'} 
      flex flex-col justify-center px-4 py-16 sm:py-24`}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className={`text-2xl sm:text-3xl font-extrabold text-center 
          ${isDark ? 'text-white' : 'text-gray-800'}`}
        >
          {title}
        </h1>
        <div className="mt-2 text-center">
          <Link 
            to={linkTo}
            className={`text-sm sm:text-base font-medium
              ${isDark 
                ? 'text-primary-400 hover:text-primary-300' 
                : 'text-primary-600 hover:text-primary-700'
              }`}
          >
            {linkText}
          </Link>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-md">
        <div className={`
          py-8 px-4 shadow-md sm:rounded-lg sm:px-10
          ${isDark 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200 shadow-md'
          }
          sm:border-none`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 