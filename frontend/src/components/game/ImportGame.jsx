import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

function ImportGame() {
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFile(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: `
            mutation ImportGame($fileContent: String!, $name: String!) {
              importGame(input: {
                fileContent: $fileContent
                name: $name
              }) {
                game {
                  id
                  name
                  width
                  height
                  speed
                  initial_state
                }
                errors
              }
            }
          `,
          variables: {
            fileContent: file,
            name
          }
        }),
      });

      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].message);
      
      if (data.data.importGame.errors?.length > 0) {
        throw new Error(data.data.importGame.errors[0]);
      }
      
      navigate('/game', { state: data.data.importGame.game });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-64px)] ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Import Game
        </h1>
        
        <div className={`rounded-lg shadow-sm p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Game Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm px-3 py-2 
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }
                  focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Game File (CSV)
              </label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md
                ${isDark 
                  ? 'border-gray-600 hover:border-gray-500' 
                  : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-center justify-center">
                    <label
                      htmlFor="file-upload"
                      className={`relative cursor-pointer rounded-md font-medium 
                        ${isDark ? 'text-primary-400' : 'text-primary-600'} 
                        hover:text-primary-500 focus-within:outline-none`}
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileChange}
                        className="sr-only"
                        required
                      />
                    </label>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    File should contain 0s and 1s separated by commas
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full px-4 py-2 rounded-lg font-medium text-white
                ${loading || !file
                  ? `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-400'} cursor-not-allowed`
                  : 'bg-primary-600 hover:bg-primary-700 transition-colors duration-200'
                }`}
            >
              {loading ? 'Importing...' : 'Import Game'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ImportGame; 