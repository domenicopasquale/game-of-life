import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { SPEEDS, formatSpeed, SPEED_VALUES, getSpeedColor, SpeedValue } from '../../utils/speed';
import { useMutation } from '@apollo/client';
import { CREATE_GAME } from '../../graphql/mutations';
import { BoltIcon } from '@heroicons/react/24/solid';

interface NewGameFormData {
  name: string;
  width: number;
  height: number;
  speed: number;
}

interface CreateGameResponse {
  createGame: {
    id: string;
    name: string;
    width: number;
    height: number;
    speed: number;
  };
}

const NewGame: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<NewGameFormData>({
    name: '',
    width: 20,
    height: 20,
    speed: SPEEDS.SPEED_1X
  });

  const [createGame] = useMutation<CreateGameResponse>(CREATE_GAME, {
    onCompleted: (data) => {
      navigate('/game', { state: data.createGame });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createGame({
        variables: {
          name: formData.name,
          width: parseInt(String(formData.width)),
          height: parseInt(String(formData.height)),
          speed: parseInt(String(formData.speed))
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpeedChange = (newSpeed: SpeedValue) => {
    setFormData(prev => ({
      ...prev,
      speed: newSpeed
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Create New Game
        </h1>

        <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Game Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter game name"
                required
                className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                  focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Width
                </label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="Width"
                  min="10"
                  max="50"
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 
                    ${isDark 
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                    focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Height
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height"
                  min="10"
                  max="50"
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 
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
                Speed: {formatSpeed(formData.speed)}
              </label>
              <div className={`flex items-center gap-2 mt-1 p-2 rounded-lg border
                ${isDark 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-300'
                }`}
              >
                <BoltIcon className={`w-5 h-5 ${getSpeedColor(formData.speed)}`} />
                <input
                  type="range"
                  min="0"
                  max="9"
                  value={SPEED_VALUES.indexOf(formData.speed as SpeedValue)}
                  onChange={(e) => handleSpeedChange(SPEED_VALUES[parseInt(e.target.value)])}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer
                    ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary-600
                    [&::-webkit-slider-thumb]:hover:bg-primary-700`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1x</span>
                <span>5x</span>
                <span>10x</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg font-medium text-white
                  bg-primary-600 hover:bg-primary-700 transition-colors duration-200`}
              >
                Create Game
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewGame;