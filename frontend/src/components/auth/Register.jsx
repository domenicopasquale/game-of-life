import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { useConfig } from '../../hooks/useConfig';

function Register() {
  const { isDark, styles } = useTheme();
  const navigate = useNavigate();
  const { API_URL } = useConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

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
            mutation CreateUser($email: String!, $password: String!, $passwordConfirmation: String!) {
              createUser(input: {
                email: $email
                password: $password
                passwordConfirmation: $passwordConfirmation
              }) {
                id
                email
              }
            }
          `,
          variables: {
            email,
            password,
            passwordConfirmation,
          },
        }),
      });

      const registerData = await response.json();

      if (registerData.errors) {
        throw new Error(registerData.errors[0].message);
      }

      const loginResponse = await fetch(`${API_URL}/graphql`, {
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

      const loginData = await loginResponse.json();

      if (loginData.errors) {
        throw new Error(loginData.errors[0].message);
      }

      localStorage.setItem('token', loginData.data.signInUser.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create your account" 
      linkText="Already have an account? Sign in" 
      linkTo="/login"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label 
            htmlFor="email" 
            className={`${styles.label} ${isDark ? styles.labelDark : styles.labelLight}`}
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className={`${styles.label} ${isDark ? styles.labelDark : styles.labelLight}`}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label
            htmlFor="passwordConfirmation"
            className={`${styles.label} ${isDark ? styles.labelDark : styles.labelLight}`}
          >
            Confirm Password
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className={`${styles.input} ${isDark ? styles.inputDark : styles.inputLight}`}
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </h3>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary-600 hover:bg-primary-700'
            }`}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register; 