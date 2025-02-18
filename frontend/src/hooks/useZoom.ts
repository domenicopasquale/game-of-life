import { useCallback } from 'react';

interface UseZoomReturn {
  zoomIn: () => number;
  zoomOut: () => number;
}

// Returns zoom in/out functions with min/max limits
export const useZoom = (initialValue: number, min: number, max: number): UseZoomReturn => {
  // Zoom in by 5 pixels, but not more than max
  const zoomIn = useCallback(() => Math.min(initialValue + 5, max), [initialValue, max]);
  
  // Zoom out by 5 pixels, but not less than min
  const zoomOut = useCallback(() => Math.max(initialValue - 5, min), [initialValue, min]);

  return { zoomIn, zoomOut };
}; 