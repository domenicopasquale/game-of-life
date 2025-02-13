import { useEffect } from 'react';

export const useKeyboardControls = ({ 
  onPlay, 
  onStep, 
  onClear, 
  onZoomIn, 
  onZoomOut 
}) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          onPlay();
          break;
        case 'n':
          onStep();
          break;
        case 'c':
          onClear();
          break;
        case '+':
          onZoomIn();
          break;
        case '-':
          onZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlay, onStep, onClear, onZoomIn, onZoomOut]);
}; 