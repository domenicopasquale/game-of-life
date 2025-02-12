import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ImportGame() {
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
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Import Game
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Game Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500 sm:text-sm
                  px-3 py-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Game File (CSV)
              </label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileChange}
                className="mt-1 block w-full"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                File should contain 0s and 1s separated by commas
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full px-4 py-2 rounded-lg font-medium text-white
                ${loading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
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