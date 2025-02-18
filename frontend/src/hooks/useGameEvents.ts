import { useEffect, useCallback, useRef } from 'react';

interface UseGameEventsProps {
  isRunning: boolean;
  onStep: () => void;
  speed: number;
}

export const useGameEvents = ({ isRunning, onStep, speed }: UseGameEventsProps): null => {
  const frameRef = useRef<number | undefined>(undefined);
  const lastStepRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!lastStepRef.current) lastStepRef.current = timestamp;

    const elapsed = timestamp - lastStepRef.current;

    if (elapsed >= speed) {
      onStep();
      lastStepRef.current = timestamp;
    }

    frameRef.current = requestAnimationFrame(animate);
  }, [speed, onStep]);

  useEffect(() => {
    if (isRunning) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isRunning, animate]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
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