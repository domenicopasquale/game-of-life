// Current state of the game grid
export interface GridState {
  isRunning: boolean;
  speed: number;
  lastUpdate: number;
  animationFrameId: number | null;
}

export interface GridLocation {
  state: GameConfig;
}

// Game configuration from the server
export interface GameConfig {
  id: string;
  width: number;
  height: number;
  speed: number;
  initial_state: boolean[][];
} 