import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { SIGN_IN_USER } from '../mutations/SignInUser';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [signIn, { loading }] = useMutation(SIGN_IN_USER, {
    onCompleted: (data) => {
      if (data.signInUser?.token) {
        localStorage.setItem('token', data.signInUser.token);
        navigate('/dashboard');
      } else {
        // If no token is present, consider the login failed
        setErrorMessage('Invalid credentials. Please try again.');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Invalid credentials. Please try again.');
      console.error('Login error:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Reset previous error
    
    try {
      const { data } = await signIn({
        variables: {
          email,
          password
        }
      });

      // Explicit result verification
      if (!data?.signInUser?.token) {
        setErrorMessage('Invalid credentials. Please try again.');
        return;
      }
    } catch (error) {
      // Network errors are handled in onError above
      console.error('Submit error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}; 