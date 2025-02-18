import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../../mutations/CreateUser';
import { useTheme } from '../../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../../utils/theme';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.createUser.token);
      navigate('/dashboard');
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await createUser({
        variables: { email, password, passwordConfirmation }
      });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className={`min-h-screen ${theme.background.primary} py-12 sm:px-6 lg:px-8`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className={`text-center text-3xl font-extrabold ${theme.text.primary}`}>
          Create your account
        </h2>
        <p className="mt-2 text-center">
          <Link 
            to="/login" 
            className={`font-medium ${theme.text.secondary} hover:text-primary-500`}
          >
            Already have an account? Sign in
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className={`py-8 px-4 ${theme.card.base} ${theme.shadow.lg} sm:rounded-lg sm:px-10`}>
          {error && (
            <div className={`mb-4 p-3 rounded-md ${theme.background.tertiary} ${theme.text.error}`}>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${theme.text.secondary}`}>
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 rounded-md 
                    ${theme.input.base} ${theme.input.focus} ${theme.input.placeholder}
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${theme.text.secondary}`}>
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Choose a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 rounded-md 
                    ${theme.input.base} ${theme.input.focus} ${theme.input.placeholder}
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="passwordConfirmation" className={`block text-sm font-medium ${theme.text.secondary}`}>
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 rounded-md 
                    ${theme.input.base} ${theme.input.focus} ${theme.input.placeholder}
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 rounded-md 
                  ${theme.button.primary} ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                  ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register; 