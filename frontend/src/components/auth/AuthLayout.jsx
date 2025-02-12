import { Link } from 'react-router-dom';

function AuthLayout({ children, title, linkText, linkTo }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h1>
        <div className="mt-2 text-center">
          <Link 
            to={linkTo}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            {linkText}
          </Link>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout; 