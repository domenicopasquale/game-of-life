import { useCallback } from 'react';
import { useGraphQL } from './useGraphQL';
import { UPDATE_GAME_SPEED, SAVE_GAME_STATE } from '../graphql/mutations';

export const useGameAPI = (gameId) => {
  const { execute } = useGraphQL();

  const updateGameSpeed = useCallback(async (speed) => {
    const data = await execute(UPDATE_GAME_SPEED, {
      id: gameId,
      speed: parseInt(speed)
    });
    return data;
  }, [gameId, execute]);

  const saveGameState = useCallback(async (cells) => {
    const stateToSave = cells.map(row => row.map(cell => Boolean(cell)));
    
    const data = await execute(SAVE_GAME_STATE, {
      input: {
        id: gameId,
        initial_state: stateToSave
      }
    });

    if (!data?.updateGame?.game) {
      throw new Error(data?.updateGame?.errors?.[0] || 'Failed to save game state');
    }

    return data;
  }, [gameId, execute]);

  return {
    updateGameSpeed,
    saveGameState
  };
}; 