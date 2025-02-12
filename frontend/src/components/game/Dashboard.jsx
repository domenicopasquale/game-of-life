import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implementare il caricamento dei giochi dal backend
    setGames([
      {
        id: 1,
        name: 'Example Game',
        width: 20,
        height: 20,
        speed: 500,
        createdAt: new Date()
      }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Games
          </h1>
          <button
            onClick={() => navigate('/new-game')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium 
              hover:bg-primary-700 transition-colors duration-200 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            New Game
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(game => (
              <div
                key={game.id}
                onClick={() => navigate('/game', { state: game })}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer 
                  hover:shadow-md transition-shadow duration-200 
                  transform hover:-translate-y-1 transition-transform duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {game.name}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Grid: {game.width}x{game.height}
                  </p>
                  <p className="text-sm text-gray-600">
                    Speed: {game.speed === 1000 ? 'Slow' : game.speed === 500 ? 'Medium' : 'Fast'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 