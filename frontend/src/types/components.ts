export interface BaseComponentProps {
  isDark: boolean;
}

export interface ControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  title?: string;
}

export interface GameGridProps {
  cells: boolean[][];
  width: number;
  cellSize: number;
  isDark: boolean;
  onCellClick: (row: number, col: number) => void;
}

export interface PatternSelectorProps extends BaseComponentProps {
  onSelect: (pattern: boolean[][]) => void;
  selectedPattern: string | null;
  onPatternSelect: (patternName: string | null) => void;
} 