import { useCallback } from 'react';

interface UseZoomReturn {
  zoomIn: () => number;
  zoomOut: () => number;
}

export const useZoom = (value: number, min: number, max: number): UseZoomReturn => {
  const zoomIn = useCallback(() => {
    return Math.min(value + 2, max);
  }, [value, max]);

  const zoomOut = useCallback(() => {
    return Math.max(value - 2, min);
  }, [value, min]);

  return { zoomIn, zoomOut };
}; 