import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PATTERNS = {
  glider: [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1]
  ],
  blinker: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ],
  block: [
    [1, 1],
    [1, 1]
  ],
  beacon: [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1]
  ]
};

function Grid() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameConfig = location.state;

  // Verifica che abbiamo i dati del gioco
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

  // Applica il pattern iniziale se presente
  useEffect(() => {
    if (gameConfig.pattern && PATTERNS[gameConfig.pattern]) {
      applyPattern(PATTERNS[gameConfig.pattern]);
    }
  }, [gameConfig.pattern]);

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
      setCells(currentCells => {
        const newCells = currentCells.map(r => [...r]);
        newCells[row][col] = !newCells[row][col];
        return newCells;
      });
    }
  };

  const applyPattern = (pattern, startRow = 5, startCol = 5) => {
    setCells(currentCells => {
      const newCells = currentCells.map(row => [...row]);
      
      pattern.forEach((row, i) => {
        row.forEach((cell, j) => {
          const newRow = (startRow + i) % gameConfig.height;
          const newCol = (startCol + j) % gameConfig.width;
          newCells[newRow][newCol] = Boolean(cell);
        });
      });
      
      return newCells;
    });
  };

  const handlePatternSelect = (e) => {
    const patternName = e.target.value;
    if (patternName in PATTERNS) {
      setIsRunning(false);
      setCells(Array(gameConfig.height).fill().map(() => Array(gameConfig.width).fill(false)));
      setTimeout(() => applyPattern(PATTERNS[patternName]), 0);
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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">
      <div className="max-w-fit mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {gameConfig.name}
            </h2>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <div className="mb-6 flex justify-center">
            <select
              onChange={handlePatternSelect}
              defaultValue={gameConfig.pattern || ""}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                bg-white"
            >
              <option value="" disabled>Select Pattern</option>
              <option value="glider">Glider</option>
              <option value="blinker">Blinker</option>
              <option value="block">Block</option>
              <option value="beacon">Beacon</option>
            </select>
          </div>

          <div 
            className="grid gap-[1px] bg-gray-200 p-[1px] rounded"
            style={{
              gridTemplateColumns: `repeat(${gameConfig.width}, 30px)`,
            }}
          >
            {cells.map((row, i) => 
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  onClick={() => toggleCell(i, j)}
                  className={`
                    w-[30px] h-[30px] cursor-pointer transition-colors duration-200
                    ${cell 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-100'
                    }
                  `}
                />
              ))
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium 
                hover:bg-primary-700 transition-colors duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isRunning ? 'Stop' : 'Start'}
            </button>

            <button
              onClick={calculateNextGeneration}
              disabled={isRunning}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }
              `}
            >
              Next Generation
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setCells(Array(gameConfig.height).fill().map(() => Array(gameConfig.width).fill(false)));
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium 
                hover:bg-red-700 transition-colors duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Clear
            </button>

            <select
              value={speed}
              onChange={handleSpeedChange}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                bg-white"
            >
              <option value={1000}>Slow</option>
              <option value={500}>Medium</option>
              <option value={200}>Fast</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grid; 