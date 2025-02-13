import { useState } from 'react';

export const useNotifications = () => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setError(message);
  };

  return { error, successMessage, showSuccess, showError };
}; 