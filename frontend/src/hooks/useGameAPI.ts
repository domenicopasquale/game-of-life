import { useCallback } from 'react';
import { useGraphQL } from './useGraphQL';
import { UPDATE_GAME_SPEED, UPDATE_GAME } from '../mutations/UpdateGame';
import { Game } from '../types/game';

interface UpdateGameResponse {
  updateGame: {
    success: boolean;
    game: Game;
  };
}

interface UseGameAPIReturn {
  updateGameSpeed: (speed: number) => Promise<any>;
  saveGameState: (cells: boolean[][]) => Promise<UpdateGameResponse>;
}

export const useGameAPI = (gameId: string): UseGameAPIReturn => {
  const { execute } = useGraphQL();

  const updateGameSpeed = useCallback(async (speed: number) => {
    const data = await execute(UPDATE_GAME_SPEED, {
      variables: {
        id: gameId,
        speed: parseInt(String(speed))
      }
    });
    return data;
  }, [gameId, execute]);

  const saveGameState = useCallback(async (cells: boolean[][]) => {
    const data = await execute<UpdateGameResponse>(UPDATE_GAME, {
      variables: {
        input: {
          id: gameId,
          initial_state: cells.map(row => row.map(cell => Boolean(cell)))
        }
      }
    });

    if (!data?.updateGame?.game) {
      throw new Error('Failed to save game state');
    }

    return data;
  }, [gameId, execute]);

  return {
    updateGameSpeed,
    saveGameState
  };
};