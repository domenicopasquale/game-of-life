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
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { CursorArrowRaysIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

function Grid() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameConfig = location.state;
  const { isDark, cellColor, cellSize } = useTheme();

  if (!gameConfig) {
    navigate('/dashboard');
    return null;
  }

  const [cells, setCells] = useState(() => {
    if (gameConfig.initial_state) {
      return gameConfig.initial_state;
    }
    return Array(gameConfig.height).fill().map(() => Array(gameConfig.width).fill(false));
  });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(gameConfig.speed);
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);

  const countNeighbors = useCallback((grid, x, y) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newX = (x + i + gameConfig.height) % gameConfig.height;
        const newY = (y + j + gameConfig.width) % gameConfig.width;
        count += grid[newX][newY] ? 1 : 0;
      }
    }
    return count;
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
      
      return nextCells;
    });
  }, [countNeighbors, gameConfig.height, gameConfig.width]);

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
            mutation UpdateGame($id: ID!, $speed: Int!) {
              updateGame(input: {
                id: $id
                speed: $speed
              }) {
                id
                speed
              }
            }
          `,
          variables: {
            id: gameConfig.id,
            speed: parseInt(updatedConfig.speed)
          }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
    } catch (err) {
      setError(err.message || 'Failed to update game');
    }
  };

  const handleSpeedChange = (e) => {
    const newSpeed = Number(e.target.value);
    setSpeed(newSpeed);
    handleUpdateGame({ speed: newSpeed });
  };

  const isGridEmpty = useCallback(() => {
    return cells.every(row => row.every(cell => !cell));
  }, [cells]);

  return (
    <div className={`min-h-[calc(100vh-64px)] ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-7xl mx-auto">
        <div className={`rounded-lg shadow-sm p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {gameConfig.name}
              </h2>

              <div className="h-9 flex items-center">
                {isGridEmpty() && !isRunning && showTutorial && (
                  <div className={`
                    rounded-lg py-2 px-3 flex-shrink-0
                    ${isDark 
                      ? 'bg-gray-700/50 border border-gray-600/50' 
                      : 'bg-blue-50/50 border border-blue-100'
                    }
                  `}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <CursorArrowRaysIcon className={`w-4 h-4 
                          ${isDark ? 'text-primary-400' : 'text-primary-600'}`} 
                        />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Click to add cells
                        </span>
                      </div>
                      <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                      <div className="flex items-center gap-2">
                        <PlayCircleIcon className={`w-4 h-4 
                          ${isDark ? 'text-primary-400' : 'text-primary-600'}`} 
                        />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Press play
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="mb-6 flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 bg-primary-600 text-white rounded-lg
                hover:bg-primary-700 transition-colors duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              title={isRunning ? 'Stop' : 'Start'}
            >
              {isRunning ? 
                <StopIcon className="w-6 h-6" /> : 
                <PlayIcon className="w-6 h-6" />
              }
            </button>

            <button
              onClick={calculateNextGeneration}
              disabled={isRunning}
              className={`p-2 rounded-lg transition-colors duration-200
                ${isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              title="Next Generation"
            >
              <ForwardIcon className="w-6 h-6" />
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setCells(Array(gameConfig.height).fill().map(() => Array(gameConfig.width).fill(false)));
              }}
              className="p-2 bg-red-600 text-white rounded-lg
                hover:bg-red-700 transition-colors duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              title="Clear Grid"
            >
              <PiBroomBold className="w-6 h-6" />
            </button>

            <div className={`flex items-center gap-2 rounded-lg p-2 border
              ${isDark 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-300'
              }`}
            >
              <BoltIcon className={`w-5 h-5 ${
                speed >= 900 ? 'text-blue-500' :
                speed >= 700 ? 'text-violet-500' :
                speed >= 500 ? 'text-green-500' :
                speed >= 300 ? 'text-yellow-500' :
                speed >= 200 ? 'text-orange-500' :
                'text-red-500'
              }`} />
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={1100 - speed}
                onChange={(e) => handleSpeedChange({ target: { value: 1100 - Number(e.target.value) } })}
                className={`w-24 h-2 rounded-lg appearance-none cursor-pointer
                  ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-primary-600
                  [&::-webkit-slider-thumb]:hover:bg-primary-700
                  [&::-webkit-slider-thumb]:transition-colors
                  [&::-webkit-slider-thumb]:duration-200`}
                title={`Speed: ${
                  speed >= 900 ? 'Very Slow' :
                  speed >= 700 ? 'Slow' :
                  speed >= 500 ? 'Medium' :
                  speed >= 300 ? 'Fast' :
                  'Very Fast'
                } (${speed}ms)`}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className={`overflow-x-auto ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4`}>
              <div className="min-w-fit">
                <div 
                  className={`grid gap-[1px] p-[1px] rounded mx-auto ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                  style={{
                    gridTemplateColumns: `repeat(${gameConfig.width}, ${cellSize}px)`,
                  }}
                >
                  {cells.map((row, i) => 
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        onClick={() => toggleCell(i, j)}
                        className={`
                          cursor-pointer
                          ${cell 
                            ? `${isDark 
                                ? 'bg-primary-500' 
                                : 'bg-primary-600'
                              }` 
                            : `${isDark 
                                ? 'bg-gray-800' 
                                : 'bg-white border border-gray-200'
                              }`
                          }
                        `}
                        style={{
                          width: `${cellSize}px`,
                          height: `${cellSize}px`
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grid; 