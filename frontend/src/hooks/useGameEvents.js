import { useEffect, useCallback } from 'react';

export const useGameEvents = ({ isRunning, onStep, speed }) => {
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(onStep, speed);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, onStep, speed]);

  const handleKeyPress = useCallback((event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      onStep();
    }
  }, [onStep]);

  useEffect(() => {
    if (!isRunning) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isRunning, handleKeyPress]);

  return null;
}; 