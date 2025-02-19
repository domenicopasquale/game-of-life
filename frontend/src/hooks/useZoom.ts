import { useCallback } from 'react';

export const useZoom = (currentSize: number, minSize: number = 5, maxSize: number = 50) => {
  // Smaller step for more gradual zoom
  const zoomStep = 2;
  
  const zoomIn = useCallback(() => {
    if (currentSize >= maxSize) return currentSize;
    return Math.min(currentSize + zoomStep, maxSize);
  }, [currentSize, maxSize]);

  const zoomOut = useCallback(() => {
    if (currentSize <= minSize) return currentSize;
    return Math.max(currentSize - zoomStep, minSize);
  }, [currentSize, minSize]);

  return { zoomIn, zoomOut };
}; 