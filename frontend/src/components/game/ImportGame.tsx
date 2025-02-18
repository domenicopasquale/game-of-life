import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { IMPORT_GAME } from '../../graphql/mutations';
import { useTheme } from '../../contexts/ThemeContext';

interface ImportGameResponse {
  importGame: {
    game: {
      id: string;
      name: string;
      width: number;
      height: number;
      speed: number;
      initial_state: boolean[][];
    } | null;
    errors?: string[];
  };
}

const ImportGame: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [importGame] = useMutation<ImportGameResponse>(IMPORT_GAME, {
    onCompleted: (data) => {
      if (data.importGame.game) {
        navigate('/game', { 
          state: data.importGame.game 
        });
      } else if (data.importGame.errors && data.importGame.errors.length > 0) {
        setError(data.importGame.errors[0]);
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Import error:", error);
      setError(error.message);
      setLoading(false);
    }
  });

  const processFile = async (file: File) => {
    if (!file) return;

    // Validazione estensione file
    const validExtensions = ['.txt', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setError('Invalid file type. Only .txt and .csv files are allowed');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const text = await file.text();
      
      // Validazione contenuto
      const rows = text.trim().split('\n').map(row => row.trim());
      
      // Verifica che il file non sia vuoto
      if (rows.length === 0) {
        throw new Error('File is empty');
      }

      // Verifica che tutte le righe abbiano la stessa lunghezza
      const firstRowLength = rows[0].length;
      if (!rows.every(row => row.length === firstRowLength)) {
        throw new Error('All rows must have the same length');
      }

      // Verifica che ci siano solo caratteri validi (. e *)
      const validContent = rows.every(row => 
        row.split('').every(char => char === '.' || char === '*')
      );

      if (!validContent) {
        throw new Error('Invalid characters in file. Only . and * are allowed');
      }

      await importGame({
        variables: {
          name: file.name.replace(/\.(txt|csv)$/, ''),
          fileContent: text
        }
      });
    } catch (err) {
      console.error("Import error:", err);
      setError(err instanceof Error ? err.message : 'Failed to import game');
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Import Game
        </h1>

        <div className={`p-6 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center
              ${isDark 
                ? 'border-gray-600 hover:border-gray-500' 
                : 'border-gray-300 hover:border-gray-400'
              }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.csv"
              className="hidden"
            />

            <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              <p className="text-lg mb-2">Drag and drop your game file here</p>
              <p className="text-sm">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className={`mt-2 px-4 py-2 text-sm font-medium rounded-md
                  ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
              >
                {loading ? 'Importing...' : 'Select File'}
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Supports .txt and .csv files with . (dead) and * (alive) cells
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportGame; 