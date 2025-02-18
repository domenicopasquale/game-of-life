import { Game } from './game';

export interface DashboardGame {
  id: string;
  name: string;
  width: number;
  height: number;
  speed: number;
  initial_state: boolean[][];
  createdAt: string;
  updatedAt: string;
}

export interface GamesQueryResponse {
  games: DashboardGame[];
}

export interface DeleteGameResponse {
  deleteGame: {
    id: string;
  };
} 