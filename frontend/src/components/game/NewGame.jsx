import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewGame() {
  const navigate = useNavigate();
  const [newGame, setNewGame] = useState({
    name: '',
    width: 20,
    height: 20,
    speed: 500,
    pattern: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implementare la creazione del gioco nel backend
    navigate('/game', { state: newGame });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Create New Game
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newGame.name}
                onChange={handleChange}
                placeholder="Enter game name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500 sm:text-sm
                  px-3 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Grid Size
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    name="width"
                    value={newGame.width}
                    onChange={handleChange}
                    placeholder="Width"
                    min="10"
                    max="50"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-primary-500 focus:ring-primary-500 sm:text-sm
                      px-3 py-2 border"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="height"
                    value={newGame.height}
                    onChange={handleChange}
                    placeholder="Height"
                    min="10"
                    max="50"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-primary-500 focus:ring-primary-500 sm:text-sm
                      px-3 py-2 border"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="speed" className="block text-sm font-medium text-gray-700">
                Speed
              </label>
              <select
                id="speed"
                name="speed"
                value={newGame.speed}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500 sm:text-sm
                  px-3 py-2 border"
              >
                <option value={1000}>Slow (1000ms)</option>
                <option value={500}>Medium (500ms)</option>
                <option value={200}>Fast (200ms)</option>
              </select>
            </div>

            <div>
              <label htmlFor="pattern" className="block text-sm font-medium text-gray-700">
                Initial Pattern
              </label>
              <select
                id="pattern"
                name="pattern"
                value={newGame.pattern}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500 sm:text-sm
                  px-3 py-2 border"
              >
                <option value="">Empty Grid</option>
                <option value="glider">Glider</option>
                <option value="blinker">Blinker</option>
                <option value="block">Block</option>
                <option value="beacon">Beacon</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium 
                  hover:bg-primary-700 transition-colors duration-200 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create Game
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewGame; 