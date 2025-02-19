import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { 
  PlusIcon, 
  TrashIcon,
  ArrowUpTrayIcon 
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { GET_GAMES } from '../../graphql/queries';
import { DELETE_GAME } from '../../graphql/mutations';
import { formatDate } from '../../utils/date';
import { DashboardGame, GamesQueryResponse, DeleteGameResponse } from '../../types/dashboard';
import { darkTheme, lightTheme } from '../../utils/theme';
import { motion } from 'framer-motion';
import Spinner from '../common/Spinner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const [deleteError, setDeleteError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { loading, error, data, refetch } = useQuery<GamesQueryResponse>(GET_GAMES, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onError: (error) => {
      console.error('Games query error:', error);
    }
  });

  const [deleteGame] = useMutation<DeleteGameResponse>(DELETE_GAME, {
    onCompleted: () => {
      setIsDeleting(null);
      refetch();
    },
    onError: (error) => {
      setIsDeleting(null);
      setDeleteError(error.message);
    }
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(id);
    setDeleteError('');
    
    try {
      await deleteGame({
        variables: { id }
      });
    } catch (err) {
      console.error('Delete error:', err);
      setIsDeleting(null);
      setDeleteError('Failed to delete game. Please try again.');
    }
  };

  const handleGameClick = (game: DashboardGame) => {
    navigate('/game', { state: game });
  };

  if (loading && !data?.games) {
    return (
      <div className={`min-h-screen ${theme.background.primary} p-4`}>
        <Spinner fullScreen />
      </div>
    );
  }

  if (error && !data?.games) {
    return (
      <div className={`min-h-screen ${theme.background.primary} p-4`}>
        <div className={`text-center ${theme.text.error}`}>
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background.primary} p-4`}>
      <h1 className={`text-2xl font-bold ${theme.text.primary} mb-4`}>
        Your Games
      </h1>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end items-center mb-8">
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/import')}
                className={`inline-flex items-center px-4 py-2 rounded-lg ${theme.button.secondary}`}
              >
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                Import Game
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/new-game')}
                className={`inline-flex items-center px-4 py-2 rounded-lg ${theme.button.primary}`}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Game
              </motion.button>
            </div>
          </div>

          {deleteError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${theme.background.tertiary} ${theme.text.error} ${theme.border.primary}`}
            >
              {deleteError}
            </motion.div>
          )}

          {loading && !data?.games && (
            <div className="flex justify-center items-center py-12">
              <Spinner size="md" />
            </div>
          )}

          {error && !data?.games && (
            <div className={`text-center py-12 ${theme.text.error}`}>
              <p>Error loading games: {error.message}</p>
              <button 
                onClick={() => refetch()}
                className={`mt-4 px-4 py-2 rounded ${theme.button.secondary}`}
              >
                Retry
              </button>
            </div>
          )}

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data?.games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleGameClick(game)}
                className={`
                  rounded-lg overflow-hidden cursor-pointer
                  ${theme.card.base} ${theme.shadow.md}
                  transform transition-all duration-200
                  hover:scale-[1.02] hover:${theme.shadow.lg}
                `}
              >
                <div className={`p-5 ${theme.card.hover}`}>
                  <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
                      {game.name}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDelete(game.id, e)}
                      className={`p-2 rounded-full ${theme.button.ghost}`}
                      disabled={isDeleting === game.id}
                    >
                      {isDeleting === game.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>
                  <div className={`mt-3 space-y-1 ${theme.text.secondary}`}>
                    <p className="flex items-center">
                      <span className="font-medium">Size:</span>
                      <span className="ml-2">{game.width}×{game.height}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Created:</span>
                      <span className="ml-2">{formatDate(game.createdAt)}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Updated:</span>
                      <span className="ml-2">{formatDate(game.updatedAt)}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {data?.games.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-16 ${theme.text.muted}`}
            >
              <p className="text-lg">No games yet. Create your first game!</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 