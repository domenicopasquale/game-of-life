import { useEffect } from 'react';

interface KeyboardControlsProps {
  onSpace?: () => void;
  onRight?: () => void;
}

export const useKeyboardControls = (props: KeyboardControlsProps): void => {
  const { onSpace, onRight } = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && onSpace) {
        e.preventDefault();
        onSpace();
      } else if (e.code === 'ArrowRight' && onRight) {
        e.preventDefault();
        onRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSpace, onRight]);
}; 