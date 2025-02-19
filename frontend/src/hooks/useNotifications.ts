import { useState, useCallback, useEffect } from 'react';

interface UseNotificationsReturn {
  error: string;
  successMessage: string;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // Auto-dismiss notifications after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        if (error) setError('');
        if (successMessage) setSuccessMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  return {
    error: error || '',
    successMessage: successMessage || '',
    showError,
    showSuccess
  };
}; 