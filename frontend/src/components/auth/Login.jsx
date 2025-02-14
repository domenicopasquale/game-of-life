import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useConfig } from '../../hooks/useConfig';

function Login() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { API_URL } = useConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation SignInUser($email: String!, $password: String!) {
              signInUser(input: { email: $email, password: $password }) {
                token
                user {
                  id
                  email
                }
              }
            }
          `,
          variables: {
            email,
            password,
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      localStorage.setItem('token', data.data.signInUser.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Sign in to your account
        </h2>
        <p className={`mt-2 text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label 
                htmlFor="email" 
                className={`block text-sm font-medium mb-1
                  ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full rounded-lg shadow-sm px-4 py-2.5 sm:text-sm
                  transition-colors duration-75 border
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  }
                  focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-1
                  ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-lg shadow-sm px-4 py-2.5 sm:text-sm
                  transition-colors duration-75 border
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  }
                  focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className={`rounded-lg p-4 text-sm
                ${isDark 
                  ? 'bg-red-900/50 text-red-200 border border-red-800'
                  : 'bg-red-50 text-red-800'
                }`}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent 
                rounded-lg shadow-sm text-sm font-medium text-white
                transition-colors duration-150
                ${loading 
                  ? `${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-400'} cursor-not-allowed` 
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }
                ${isDark ? 'focus:ring-offset-gray-900' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 