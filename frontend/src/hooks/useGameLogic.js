import { useState, useCallback } from 'react';
import { SPEED_CONFIG } from '../components/game/config';

export const useGameLogic = (initialConfig) => {
  const [cells, setCells] = useState(() => {
    if (initialConfig.initial_state) {
      return JSON.parse(JSON.stringify(initialConfig.initial_state));
    }
    return Array(initialConfig.height).fill().map(() => 
      Array(initialConfig.width).fill(false)
    );
  });

  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(initialConfig.speed);
  const [showTutorial, setShowTutorial] = useState(true);

  const countNeighbors = useCallback((grid, x, y) => {
    return [-1, 0, 1].reduce((count, i) => 
      count + [-1, 0, 1].reduce((innerCount, j) => {
        if (i === 0 && j === 0) return innerCount;
        const newX = (x + i + initialConfig.height) % initialConfig.height;
        const newY = (y + j + initialConfig.width) % initialConfig.width;
        return innerCount + (grid[newX][newY] ? 1 : 0);
      }, 0)
    , 0);
  }, [initialConfig.height, initialConfig.width]);

  const calculateNextGeneration = useCallback(() => {
    setCells(currentCells => {
      const nextCells = currentCells.map(row => [...row]);
      
      for (let i = 0; i < initialConfig.height; i++) {
        for (let j = 0; j < initialConfig.width; j++) {
          const neighbors = countNeighbors(currentCells, i, j);
          
          if (currentCells[i][j]) {
            nextCells[i][j] = neighbors === 2 || neighbors === 3;
          } else {
            nextCells[i][j] = neighbors === 3;
          }
        }
      }
      
      return nextCells;
    });
  }, [countNeighbors, initialConfig.height, initialConfig.width]);

  const toggleCell = useCallback((row, col) => {
    if (!isRunning) {
      setShowTutorial(false);
      setCells(currentCells => {
        const newCells = currentCells.map(r => [...r]);
        newCells[row][col] = !newCells[row][col];
        return newCells;
      });
    }
  }, [isRunning]);

  const resetGrid = useCallback(() => {
    setIsRunning(false);
    setCells(Array(initialConfig.height).fill().map(() => 
      Array(initialConfig.width).fill(false)
    ));
  }, [initialConfig.height, initialConfig.width]);

  const isGridEmpty = useCallback(() => {
    return cells.every(row => row.every(cell => !cell));
  }, [cells]);

  return {
    cells,
    isRunning,
    speed,
    showTutorial,
    setIsRunning,
    setSpeed,
    calculateNextGeneration,
    toggleCell,
    resetGrid,
    isGridEmpty
  };
}; 