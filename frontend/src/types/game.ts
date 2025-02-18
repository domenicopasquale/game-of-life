export interface Game {
  id: string;
  name: string;
  width: number;
  height: number;
  speed: number;
  initial_state?: boolean[][];
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface ImportResponse {
  importGame: {
    game: Game | null;
    errors: string[];
  };
} 