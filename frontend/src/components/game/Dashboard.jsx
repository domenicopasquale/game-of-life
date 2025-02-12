import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GameSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

function Dashboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:3001/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            query: `
              query GetMyGames {
                myGames {
                  id
                  name
                  width
                  height
                  speed
                  pattern
                  createdAt
                }
              }
            `
          }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        setGames(data.data.myGames);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleDeleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: `
            mutation DeleteGame($id: ID!) {
              deleteGame(input: { id: $id }) {
                success
                errors
              }
            }
          `,
          variables: { id }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      if (data.data.deleteGame.success) {
        setGames(games.filter(game => game.id !== id));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Games
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/new-game')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium 
                hover:bg-primary-700 transition-colors duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              New Game
            </button>
            <button
              onClick={() => navigate('/import')}
              className="px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg font-medium 
                hover:bg-primary-50 transition-colors duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Import Game
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <GameSkeleton key={i} />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No games yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first game to get started!
            </p>
            <button
              onClick={() => navigate('/new-game')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium 
                hover:bg-primary-700 transition-colors duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Game
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(game => (
              <div
                key={game.id}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer 
                  hover:shadow-md transition-shadow duration-200 
                  transform hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {game.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGame(game.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
                <div 
                  onClick={() => navigate('/game', { state: game })}
                  className="space-y-1"
                >
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