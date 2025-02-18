import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayIcon, 
  StopIcon, 
  ForwardIcon
} from '@heroicons/react/24/solid';
import { PiBroomBold } from 'react-icons/pi';
import { useTheme } from '../../contexts/ThemeContext';
import { FaFloppyDisk } from 'react-icons/fa6';
import { useNotifications } from '../../hooks/useNotifications';
import { useZoom } from '../../hooks/useZoom';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { NotificationMessage } from './NotificationMessage';
import { AnimatePresence } from 'framer-motion';
import { ZoomControls } from './ZoomControls';
import { GridStats } from './GridStats';
import { SpeedControl } from './SpeedControl';
import { SPEED_VALUES } from '../../utils/speed';
import { GridState, GameConfig } from '../../types/grid';
import { SpeedValue } from '../../utils/speed';
import { ControlButton } from './ControlButton';
import { PatternSelector } from './PatternSelector';
import { motion } from 'framer-motion';
import { Tutorial } from './Tutorial';
import { UPDATE_GAME } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';

interface GridProps {
  gameConfig: GameConfig;
  isDark: boolean;
}

const Grid: React.FC<GridProps> = ({ gameConfig, isDark }) => {
  const navigate = useNavigate();
  const { error, successMessage, showSuccess, showError } = useNotifications();
  const { cellSize, setCellSize } = useTheme();

  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState<SpeedValue>(() => {
    if (!SPEED_VALUES.includes(gameConfig.speed as SpeedValue)) {
      return SPEED_VALUES[0];
    }
    return gameConfig.speed as SpeedValue;
  });

  const gameStateRef = useRef<GridState>({
    isRunning: false,
    speed: gameConfig.speed,
    lastUpdate: 0,
    animationFrameId: null
  });

  const [cells, setCells] = useState<boolean[][]>(() => {
    if (gameConfig.initial_state) {
      // Create a deep copy of the matrix
      return JSON.parse(JSON.stringify(gameConfig.initial_state));
    }
    
    // If there's no initial_state, create an empty matrix
    return Array(gameConfig.height).fill(null)
      .map(() => Array(gameConfig.width).fill(false));
  });

  const [generation, setGeneration] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const { zoomIn, zoomOut } = useZoom(cellSize, 10, 50);

  const [showTutorial, setShowTutorial] = useState(() => {
    const tutorialSeen = localStorage.getItem('tutorial_seen');
    return !tutorialSeen;
  });

  useEffect(() => {
    if (!gameConfig) {
      navigate('/dashboard');
    }
  }, [gameConfig, navigate]);

  const countNeighbors = (grid: boolean[][], x: number, y: number): number => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newX = (x + i + gameConfig.height) % gameConfig.height;
        const newY = (y + j + gameConfig.width) % gameConfig.width;
        if (grid[newX][newY]) count++;
      }
    }
    return count;
  };

  const nextGeneration = useCallback(() => {
    // Simplified version that ensures a single call
    const newCells = cells.map((row, i) => 
      row.map((cell, j) => {
        const neighbors = countNeighbors(cells, i, j);
        if (cell) {
          return neighbors === 2 || neighbors === 3;
        }
        return neighbors === 3;
      })
    );
    
    setCells(newCells);
    setGeneration(g => g + 1);
  }, [cells, gameConfig.height, gameConfig.width]);

  const updateGame = useCallback(() => {
    const now = performance.now();
    const state = gameStateRef.current;

    if (state.isRunning && now - state.lastUpdate >= state.speed) {
      nextGeneration();
      state.lastUpdate = now;
    }

    state.animationFrameId = requestAnimationFrame(updateGame);
  }, [nextGeneration]);

  useEffect(() => {
    gameStateRef.current.speed = speed;
  }, [speed]);

  useEffect(() => {
    gameStateRef.current.isRunning = isRunning;
    if (isRunning) {
      gameStateRef.current.lastUpdate = performance.now();
      gameStateRef.current.animationFrameId = requestAnimationFrame(updateGame);
    } else if (gameStateRef.current.animationFrameId) {
      cancelAnimationFrame(gameStateRef.current.animationFrameId);
    }

    return () => {
      if (gameStateRef.current.animationFrameId) {
        cancelAnimationFrame(gameStateRef.current.animationFrameId);
      }
    };
  }, [isRunning, updateGame]);

  const handleCellClick = (row: number, col: number) => {
    if (isRunning) return;
    
    setCells(prevCells => {
      const newCells = [...prevCells];
      newCells[row] = [...newCells[row]];
      newCells[row][col] = !newCells[row][col];
      return newCells;
    });
  };

  const handlePatternSelect = (pattern: boolean[][]) => {
    setCells(() => {
      // Create new empty grid
      const newCells = Array(gameConfig.height).fill(null)
        .map(() => Array(gameConfig.width).fill(false));
      
      // Calculate center position
      const startRow = Math.floor((gameConfig.height - pattern.length) / 2);
      const startCol = Math.floor((gameConfig.width - pattern[0].length) / 2);

      // Place pattern in center
      pattern.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (startRow + i < gameConfig.height && startCol + j < gameConfig.width) {
            newCells[startRow + i][startCol + j] = cell;
          }
        });
      });

      return newCells;
    });
    
    setGeneration(0);
  };

  const [saveGame] = useMutation(UPDATE_GAME, {
    onCompleted: () => {
      showSuccess('Game saved successfully');
    },
    onError: (err) => {
      showError(err.message || 'Failed to save game');
    }
  });

  const handleSave = async () => {
    try {
      await saveGame({
        variables: {
          id: gameConfig.id,
          initial_state: cells
        }
      });
    } catch (err) {
      // Gli errori sono già gestiti in onError
    }
  };

  const resetGrid = () => {
    setCells(Array(gameConfig.height).fill(null).map(() => 
      Array(gameConfig.width).fill(false)
    ));
    setGeneration(0);
    setSelectedPattern(null);
  };

  const population = cells.reduce((count, row) => 
    count + row.reduce((rowCount, cell) => rowCount + (cell ? 1 : 0), 0), 0
  );

  const toggleRunning = useCallback(() => {
    setIsRunning(current => !current);
  }, []);

  useKeyboardControls({
    onSpace: toggleRunning,
    onRight: useCallback(() => {
      if (!isRunning) {
        nextGeneration();
      }
    }, [isRunning, nextGeneration])
  });

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorial_seen', 'true');
  };

  if (!gameConfig) return null;

  return (
    <div className="h-screen flex flex-col">
      {/* Game controls navbar */}
      <div className={`flex-none sticky top-0 z-50 ${isDark ? 'bg-gray-900' : 'bg-white'} border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Game controls */}
            <div className="flex items-center gap-3">
              <ControlButton
                onClick={toggleRunning}
                className={`p-2 rounded-lg ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={isRunning ? 'Stop (Space)' : 'Play (Space)'}
              >
                {isRunning ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
              </ControlButton>
              
              <ControlButton
                onClick={nextGeneration}
                disabled={isRunning}
                className={`p-2 rounded-lg ${
                  isRunning 
                    ? isDark
                      ? 'opacity-50 cursor-not-allowed bg-gray-700 text-gray-500'
                      : 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
                    : isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Next Generation (→)"
              >
                <ForwardIcon className="w-5 h-5" />
              </ControlButton>

              <SpeedControl
                speed={speed}
                onSpeedChange={setSpeed}
                isDark={isDark}
              />

              <PatternSelector
                onSelect={handlePatternSelect}
                selectedPattern={selectedPattern}
                onPatternSelect={setSelectedPattern}
                isDark={isDark}
              />
            </div>

            {/* Stats and secondary controls */}
            <div className="flex items-center gap-4">
              <GridStats
                generation={generation}
                population={population}
                isDark={isDark}
              />
              
              <div className="flex items-center gap-2">
                <ZoomControls
                  onZoomIn={() => setCellSize(zoomIn())}
                  onZoomOut={() => setCellSize(zoomOut())}
                  isDark={isDark}
                />
                
                <ControlButton
                  onClick={resetGrid}
                  className={`p-2 rounded-lg ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Clear Grid"
                >
                  <PiBroomBold className="w-5 h-5" />
                </ControlButton>

                <ControlButton
                  onClick={handleSave}
                  className={`p-2 rounded-lg ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Save Game"
                >
                  <FaFloppyDisk className="w-5 h-5" />
                </ControlButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full p-4 pb-20">
          <motion.div 
            className="h-full flex items-center justify-center"
            animate={{ 
              backgroundColor: isDark ? '#111827' : '#F9FAFB'
            }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="relative"
              style={{
                width: `${cellSize * gameConfig.width}px`,
                height: `${cellSize * gameConfig.height}px`
              }}
            >
              <div className="grid" style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gameConfig.width}, ${cellSize}px)`,
                gap: '1px'
              }}>
                {cells.map((row, i) => 
                  row.map((cell, j) => (
                    <motion.div
                      key={`${i}-${j}`}
                      initial={false}
                      animate={{ 
                        backgroundColor: cell 
                          ? (isDark ? '#e5e7eb' : '#1f2937') // gray-200 in dark, gray-800 in light
                          : (isDark ? '#1f2937' : '#ffffff')  // gray-800 in dark, white in light
                      }}
                      transition={{ duration: 0.2 }}
                      className={`
                        ${!isRunning ? 'hover:bg-gray-400' : ''}
                      `}
                      style={{ 
                        width: `${cellSize}px`, 
                        height: `${cellSize}px`,
                        cursor: isRunning ? 'default' : 'pointer'
                      }}
                      onClick={() => !isRunning && handleCellClick(i, j)}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {(error || successMessage) && (
          <div className="fixed bottom-4 right-4">
            <NotificationMessage
              message={error || successMessage}
              type={error ? 'error' : 'success'}
            />
          </div>
        )}
      </AnimatePresence>

      {showTutorial && (
        <Tutorial 
          isDark={isDark} 
          onClose={handleCloseTutorial}
        />
      )}
    </div>
  );
};

export default Grid; 