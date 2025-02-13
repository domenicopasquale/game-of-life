import { useState, useCallback } from 'react';

export const useZoom = (initialSize = 15, min = 5, max = 30) => {
  const [cellSize, setCellSize] = useState(initialSize);

  const zoomIn = useCallback(() => {
    setCellSize(prev => Math.min(prev + 2, max));
  }, [max]);

  const zoomOut = useCallback(() => {
    setCellSize(prev => Math.max(prev - 2, min));
  }, [min]);

  return { cellSize, zoomIn, zoomOut };
}; 