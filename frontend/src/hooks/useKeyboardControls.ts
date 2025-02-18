import { useEffect, useRef } from 'react';

interface KeyboardControlsProps {
  onSpace: () => void;
  onRight: () => void;
}

export const useKeyboardControls = ({ onSpace, onRight }: KeyboardControlsProps) => {
  const keyPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keyPressed.current[event.code]) return; // Skip if key is already pressed
      
      if (event.code === 'Space') {
        event.preventDefault();
        keyPressed.current[event.code] = true;
        onSpace();
      } else if (event.code === 'ArrowRight') {
        event.preventDefault();
        keyPressed.current[event.code] = true;
        onRight();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keyPressed.current[event.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onSpace, onRight]);
}; 