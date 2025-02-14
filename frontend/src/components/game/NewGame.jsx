import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoltIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../../contexts/ThemeContext';
import { useConfig } from '../../hooks/useConfig';

function NewGame() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { API_URL } = useConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newGame, setNewGame] = useState({
    name: '',
    width: 20,
    height: 20,
    speed: 500
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: `
            mutation CreateGame($name: String!, $width: Int!, $height: Int!, $speed: Int!) {
              createGame(input: {
                name: $name
                width: $width
                height: $height
                speed: $speed
              }) {
                id
                name
                width
                height
                speed
              }
            }
          `,
          variables: {
            name: newGame.name,
            width: parseInt(newGame.width),
            height: parseInt(newGame.height),
            speed: parseInt(newGame.speed)
          }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      navigate('/game', { state: data.data.createGame });
    } catch (err) {
      setError(err.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`min-h-[calc(100vh-64px)] ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Create New Game
        </h1>
        
        <div className={`rounded-lg shadow-sm p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={newGame.name}
                onChange={handleChange}
                placeholder="Enter game name"
                required
                className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }
                  focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Grid Size
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="width"
                  value={newGame.width}
                  onChange={handleChange}
                  placeholder="Width"
                  min="10"
                  max="100"
                  required
                  className={`block w-full rounded-md shadow-sm px-3 py-2 
                    ${isDark 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                    focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                />
                <input
                  type="number"
                  name="height"
                  value={newGame.height}
                  onChange={handleChange}
                  placeholder="Height"
                  min="10"
                  max="100"
                  required
                  className={`block w-full rounded-md shadow-sm px-3 py-2 
                    ${isDark 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                    focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Speed
              </label>
              <div className={`flex items-center gap-2 mt-1 p-2 rounded-lg border
                ${isDark 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-300'
                }`}
              >
                <BoltIcon className={`w-5 h-5 ${
                  newGame.speed >= 900 ? 'text-blue-500' :
                  newGame.speed >= 700 ? 'text-violet-500' :
                  newGame.speed >= 500 ? 'text-green-500' :
                  newGame.speed >= 300 ? 'text-yellow-500' :
                  newGame.speed >= 200 ? 'text-orange-500' :
                  'text-red-500'
                }`} />
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="100"
                  value={1100 - newGame.speed}
                  onChange={(e) => handleChange({
                    target: {
                      name: 'speed',
                      value: 1100 - Number(e.target.value)
                    }
                  })}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer
                    ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary-600
                    [&::-webkit-slider-thumb]:hover:bg-primary-700`}
                  title={`Speed: ${
                    newGame.speed >= 900 ? 'Very Slow' :
                    newGame.speed >= 700 ? 'Slow' :
                    newGame.speed >= 500 ? 'Medium' :
                    newGame.speed >= 300 ? 'Fast' :
                    'Very Fast'
                  } (${newGame.speed}ms)`}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium text-white
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 transition-colors duration-200'
                  }`}
              >
                {loading ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewGame; 