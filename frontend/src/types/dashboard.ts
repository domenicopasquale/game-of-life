import { Game } from './game';

export interface DashboardGame extends Game {
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