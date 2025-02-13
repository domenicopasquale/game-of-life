import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  PlayIcon, 
  StopIcon, 
  ForwardIcon, 
  BoltIcon
} from '@heroicons/react/24/solid';
import { PiBroomBold } from 'react-icons/pi';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  CursorArrowRaysIcon, 
  PlayCircleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { FaFloppyDisk } from 'react-icons/fa6';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useGameAPI } from '../../hooks/useGameAPI';
import { useGameEvents } from '../../hooks/useGameEvents';
import { useNotifications } from '../../hooks/useNotifications';
import { useZoom } from '../../hooks/useZoom';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { NotificationMessage } from './components/NotificationMessage';
import { AnimatePresence } from 'framer-motion';
import { PatternSelector } from './components/PatternSelector';
import { ZoomControls } from './components/ZoomControls';
import { GridStats } from './components/GridStats';
import { motion } from 'framer-motion';
import { SpeedControl } from './components/SpeedControl';
import { Tutorial } from './components/Tutorial';

function Grid() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameConfig = location.state;
  const { isDark, cellSize, setCellSize } = useTheme();
  const { error, successMessage, showSuccess, showError } = useNotifications();
  const { zoomIn: handleZoomIn, zoomOut: handleZoomOut } = useZoom(cellSize, 5, 30);
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

  if (!gameConfig) {
    navigate('/dashboard');
    return null;
  }

  const [cells, setCells] = useState(() => {
    if (gameConfig.initial_state) {
      return JSON.parse(JSON.stringify(gameConfig.initial_state));
    }
    return Array(gameConfig.height).fill().map(() => Array(gameConfig.width).fill(false));
  });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(gameConfig.speed);

  const countNeighbors = useCallback((grid, x, y) => {
    return [-1, 0, 1].reduce((count, i) => 
      count + [-1, 0, 1].reduce((innerCount, j) => {
        if (i === 0 && j === 0) return innerCount;
        const newX = (x + i + gameConfig.height) % gameConfig.height;
        const newY = (y + j + gameConfig.width) % gameConfig.width;
        return innerCount + (grid[newX][newY] ? 1 : 0);
      }, 0)
    , 0);
  }, [gameConfig.height, gameConfig.width]);

  const calculateNextGeneration = useCallback(() => {
    setCells(currentCells => {
      const nextCells = currentCells.map(row => [...row]);
      
      for (let i = 0; i < gameConfig.height; i++) {
        for (let j = 0; j < gameConfig.width; j++) {
          const neighbors = countNeighbors(currentCells, i, j);
          
          if (currentCells[i][j]) {
            if (neighbors < 2 || neighbors > 3) {
              nextCells[i][j] = false;
            }
          } else {
            if (neighbors === 3) {
              nextCells[i][j] = true;
            }
          }
        }
      }
      
      setGeneration(g => g + 1);
      const newPopulation = nextCells.flat().filter(Boolean).length;
      setPopulation(newPopulation);
      
      return nextCells;
    });
  }, [countNeighbors, gameConfig.height, gameConfig.width]);

  const applyPattern = useCallback((pattern) => {
    if (isRunning) return;

    const startRow = Math.floor((gameConfig.height - pattern.length) / 2);
    const startCol = Math.floor((gameConfig.width - pattern[0].length) / 2);

    setCells(currentCells => {
      const newCells = currentCells.map(row => [...row].fill(false));
      
      pattern.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (startRow + i >= 0 && startRow + i < gameConfig.height &&
              startCol + j >= 0 && startCol + j < gameConfig.width) {
            newCells[startRow + i][startCol + j] = cell;
          }
        });
      });

      return newCells;
    });

    setShowTutorial(false);
    setGeneration(0);
    setPopulation(pattern.flat().filter(Boolean).length);
  }, [isRunning, gameConfig.height, gameConfig.width]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(calculateNextGeneration, speed);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, calculateNextGeneration, speed]);

  const toggleCell = (row, col) => {
    if (!isRunning) {
      setShowTutorial(false);
      setCells(currentCells => {
        const newCells = currentCells.map(r => [...r]);
        newCells[row][col] = !newCells[row][col];
        return newCells;
      });
    }
  };

  const handleUpdateGame = async (updatedConfig) => {
    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: `
            mutation UpdateGame($input: UpdateGameInput!) {
              updateGame(input: $input) {
                game {
                  id
                  speed
                }
                errors
              }
            }
          `,
          variables: {
            input: {
              id: gameConfig.id,
              speed: parseInt(updatedConfig.speed)
            }
          }
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      if (!data?.updateGame?.game) {
        throw new Error(data?.updateGame?.errors?.[0] || 'Failed to update game');
      }
    } catch (err) {
      showError(err.message || 'Failed to update game');
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    handleUpdateGame({ speed: newSpeed });
  };

  const isGridEmpty = useCallback(() => {
    return cells.every(row => row.every(cell => !cell));
  }, [cells]);

  const handleSaveState = async () => {
    try {
      const stateToSave = cells.map(row => 
        row.map(cell => Boolean(cell))
      );

      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: `
            mutation SaveGameState($input: UpdateGameInput!) {
              updateGame(input: $input) {
                game {
                  id
                  name
                  initial_state
                }
                errors
              }
            }
          `,
          variables: {
            input: {
              id: gameConfig.id,
              initial_state: stateToSave
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
      }

      const { data, errors } = await response.json();
      
      if (errors) {
        throw new Error(errors[0].message);
      }
      
      if (!data?.updateGame?.game) {
        throw new Error(data?.updateGame?.errors?.[0] || 'Failed to save game state');
      }

      showSuccess('Game state saved successfully!');
    } catch (err) {
      showError(err.message || 'Failed to save game state');
    }
  };

  const resetGrid = () => {
    setIsRunning(false);
    setCells(Array(gameConfig.height).fill().map(() => Array(gameConfig.width).fill(false)));
    setSelectedPattern(null);
    setShowTutorial(true);
  };

  const getSpeedLabel = (speed) => {
    if (speed >= 900) return 'Very Slow';
    if (speed >= 700) return 'Slow';
    if (speed >= 500) return 'Medium';
    if (speed >= 300) return 'Fast';
    return 'Very Fast';
  };

  const ControlButton = ({ onClick, disabled, title, className, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      title={title}
    >
      {children}
    </button>
  );

  const GameGrid = ({ cells, width, cellSize, isDark, onCellClick }) => (
    <div className={`grid gap-[1px] p-[1px] rounded mx-auto ${
      isDark ? 'bg-gray-700' : 'bg-gray-200'
    }`}
    style={{ gridTemplateColumns: `repeat(${width}, ${cellSize}px)` }}>
      {cells.map((row, i) => 
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => onCellClick(i, j)}
            className={`cursor-pointer ${
              cell 
                ? `${isDark ? 'bg-primary-500' : 'bg-primary-600'}` 
                : `${isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'}`
            }`}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`
            }}
          />
        ))
      )}
    </div>
  );

  const onZoomIn = useCallback(() => {
    handleZoomIn();
    setCellSize(prev => Math.min(prev + 2, 30));
  }, [handleZoomIn, setCellSize]);

  const onZoomOut = useCallback(() => {
    handleZoomOut();
    setCellSize(prev => Math.max(prev - 2, 5));
  }, [handleZoomOut, setCellSize]);

  useKeyboardControls({
    onPlay: () => setIsRunning(prev => !prev),
    onStep: calculateNextGeneration,
    onClear: resetGrid,
    onZoomIn,
    onZoomOut
  });

  return (
    <div className={`min-h-[calc(100vh-64px)] ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-2`}>
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className={`rounded-lg shadow-sm p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} flex flex-col flex-grow`}>
          <div className="flex-none space-y-2 relative">
            <div className="flex items-center justify-between gap-4">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {gameConfig.name}
              </h2>

              <div className="flex items-center gap-4">
                <GridStats 
                  cells={cells}
                  generation={generation}
                  population={population}
                />
              </div>
            </div>

            <AnimatePresence>
              {isGridEmpty() && !isRunning && showTutorial && (
                <Tutorial isDark={isDark} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(successMessage || error) && (
                <div className="flex justify-center">
                  {successMessage && <NotificationMessage message={successMessage} type="success" />}
                  {error && error !== successMessage && <NotificationMessage message={error} type="error" />}
                </div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-opacity-50
              ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/50'} relative z-50"
            >
              <div className="flex items-center gap-1">
                <ControlButton
                  onClick={() => setIsRunning(!isRunning)}
                  className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  title={isRunning ? 'Stop' : 'Start'}
                >
                  {isRunning ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                </ControlButton>

                <ControlButton
                  onClick={calculateNextGeneration}
                  disabled={isRunning}
                  className={`p-1.5 rounded-lg ${isRunning ? 'bg-gray-300 text-gray-500' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                  title="Next Generation"
                >
                  <ForwardIcon className="w-5 h-5" />
                </ControlButton>

                <ControlButton
                  onClick={resetGrid}
                  className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  title="Clear Grid"
                >
                  <PiBroomBold className="w-5 h-5" />
                </ControlButton>

                <ControlButton
                  onClick={handleSaveState}
                  className={`p-1.5 rounded-lg ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  title="Save current state"
                >
                  <FaFloppyDisk className="w-5 h-5" />
                </ControlButton>
              </div>

              <div className="flex-1 max-w-md">
                <PatternSelector 
                  onSelect={applyPattern} 
                  isDark={isDark} 
                  selectedPattern={selectedPattern}
                  onPatternSelect={setSelectedPattern}
                />
              </div>

              <div className="flex items-center gap-2">
                <SpeedControl speed={speed} onSpeedChange={handleSpeedChange} isDark={isDark} />
                <ZoomControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} isDark={isDark} />
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-auto min-h-0 mt-2 relative z-0">
            <div className="h-full flex items-center justify-center">
              <GameGrid 
                cells={cells} 
                width={gameConfig.width} 
                cellSize={cellSize} 
                isDark={isDark} 
                onCellClick={toggleCell} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grid;