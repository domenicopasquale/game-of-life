export interface GridState {
  isRunning: boolean;
  speed: number;
  lastUpdate: number;
  animationFrameId: number | null;
}

export interface GridLocation {
  state: GameConfig;
}

export interface GameConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  speed: number;
  initial_state?: boolean[][];
} 