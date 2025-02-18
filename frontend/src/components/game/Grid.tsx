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
import { NotificationMessage } from './components/NotificationMessage';
import { AnimatePresence } from 'framer-motion';
import { PatternSelector } from './components/PatternSelector';
import { ZoomControls } from './components/ZoomControls';
import { GridStats } from './components/GridStats';
import { SpeedControl } from './components/SpeedControl';
import { Tutorial } from './components/Tutorial';
import { useConfig } from '../../hooks/useConfig';
import { SPEED_VALUES } from '../../utils/speed';
import { GridState, GameConfig } from '../../types/grid';
import { SpeedValue } from '../../utils/speed';

interface GridProps {
  gameConfig: GameConfig;
  isDark: boolean;
}

const Grid: React.FC<GridProps> = ({ gameConfig, isDark }) => {
  const navigate = useNavigate();
  const { API_URL } = useConfig();
  const { error, successMessage, showSuccess, showError } = useNotifications();
  const { cellSize, setCellSize } = useTheme();

  const [showTutorial, setShowTutorial] = useState(true);
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
    console.log("Initial state from gameConfig:", gameConfig.initial_state);
    
    if (gameConfig.initial_state) {
      // Crea una copia profonda della matrice
      const matrix = JSON.parse(JSON.stringify(gameConfig.initial_state));
      console.log("Created matrix:", matrix);
      return matrix;
    }
    
    // Se non c'è initial_state, crea una matrice vuota
    const emptyMatrix = Array(gameConfig.height).fill(null)
      .map(() => Array(gameConfig.width).fill(false));
    console.log("Created empty matrix:", emptyMatrix);
    return emptyMatrix;
  });

  const [generation, setGeneration] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const { zoomIn, zoomOut } = useZoom(cellSize, 10, 50);

  useEffect(() => {
    if (!gameConfig) {
      navigate('/dashboard');
    }
  }, [gameConfig, navigate]);

  useEffect(() => {
    console.log("Current cells state:", cells);
    console.log("Grid dimensions:", gameConfig.width, "x", gameConfig.height);
  }, [cells, gameConfig.width, gameConfig.height]);

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
    setCells(currentCells => {
      const newCells = currentCells.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countNeighbors(currentCells, i, j);
          if (cell) {
            return neighbors === 2 || neighbors === 3;
          }
          return neighbors === 3;
        })
      );
      return newCells;
    });
    setGeneration(prev => prev + 1);
  }, []);

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
    setCells(currentCells => {
      const newCells = [...currentCells];
      newCells[row] = [...newCells[row]];
      newCells[row][col] = !newCells[row][col];
      return newCells;
    });
  };

  const handlePatternSelect = (pattern: boolean[][]) => {
    setCells(currentCells => {
      const newCells = [...currentCells];
      const startRow = Math.floor((gameConfig.height - pattern.length) / 2);
      const startCol = Math.floor((gameConfig.width - pattern[0].length) / 2);

      pattern.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (startRow + i < gameConfig.height && startCol + j < gameConfig.width) {
            if (!newCells[startRow + i]) newCells[startRow + i] = [];
            newCells[startRow + i][startCol + j] = cell;
          }
        });
      });

      return newCells;
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: `
            mutation UpdateGame($id: ID!, $initial_state: [[Boolean!]!]!) {
              updateGame(input: {
                id: $id
                initial_state: $initial_state
              }) {
                game {
                  id
                  name
                  initial_state
                }
              }
            }
          `,
          variables: {
            id: gameConfig.id,
            initial_state: cells
          }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      showSuccess('Game saved successfully');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to save game');
    }
  };

  const handleClear = () => {
    setCells(Array(gameConfig.height).fill(null).map(() => 
      Array(gameConfig.width).fill(false)
    ));
    setGeneration(0);
    setSelectedPattern(null);
  };

  const population = cells.reduce((count, row) => 
    count + row.reduce((rowCount, cell) => rowCount + (cell ? 1 : 0), 0), 0
  );

  useKeyboardControls({
    onSpace: () => setIsRunning(prev => !prev),
    onRight: nextGeneration
  });

  if (!gameConfig) return null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Controls Column */}
            <div className="w-full md:w-64 space-y-4">
              <div className={`p-4 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className={`flex-1 p-2 rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title={isRunning ? 'Stop' : 'Start'}
                    >
                      {isRunning ? <StopIcon className="w-5 h-5 mx-auto" /> : <PlayIcon className="w-5 h-5 mx-auto" />}
                    </button>
                    <button
                      onClick={nextGeneration}
                      disabled={isRunning}
                      className={`flex-1 p-2 rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      } disabled:opacity-50`}
                      title="Next generation"
                    >
                      <ForwardIcon className="w-5 h-5 mx-auto" />
                    </button>
                  </div>

                  <SpeedControl
                    speed={speed}
                    onSpeedChange={setSpeed}
                    isDark={isDark}
                  />

                  <div className="flex justify-between items-center">
                    <ZoomControls
                      onZoomIn={() => setCellSize(zoomIn())}
                      onZoomOut={() => setCellSize(zoomOut())}
                      isDark={isDark}
                    />
                    <button
                      onClick={handleClear}
                      className={`p-1.5 rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title="Clear grid"
                    >
                      <PiBroomBold className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSave}
                      className={`p-1.5 rounded-lg ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title="Save game"
                    >
                      <FaFloppyDisk className="w-5 h-5" />
                    </button>
                  </div>

                  <GridStats
                    cells={cells}
                    generation={generation}
                    population={population}
                    isDark={isDark}
                  />

                  <PatternSelector
                    onSelect={handlePatternSelect}
                    isDark={isDark}
                    selectedPattern={selectedPattern}
                    onPatternSelect={setSelectedPattern}
                  />
                </div>
              </div>

              {showTutorial && (
                <Tutorial 
                  isDark={isDark} 
                  onClose={() => setShowTutorial(false)}
                />
              )}
            </div>

            {/* Grid Column */}
            <div className="flex-1">
              <div 
                className={`p-4 rounded-lg shadow-sm overflow-auto
                  ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div 
                  className="grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gameConfig.width}, ${cellSize}px)`,
                    gap: '1px',
                    backgroundColor: isDark ? '#374151' : '#E5E7EB'
                  }}
                >
                  {cells.map((row, i) => 
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={`
                          transition-colors duration-100
                          ${cell 
                            ? (isDark ? 'bg-gray-200' : 'bg-gray-800')
                            : (isDark ? 'bg-gray-800' : 'bg-white')
                          }
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
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default Grid; 