import { useState, useCallback } from 'react';

interface UseNotificationsReturn {
  error: string;
  successMessage: string;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const showError = useCallback((message: string) => {
    setError(message);
    setSuccessMessage('');
    setTimeout(() => setError(''), 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setError('');
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  return {
    error,
    successMessage,
    showError,
    showSuccess
  };
}; 