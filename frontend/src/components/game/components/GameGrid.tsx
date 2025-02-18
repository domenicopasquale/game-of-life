import { motion, useMotionValue, MotionValue } from 'framer-motion';
import { AnimatedCell } from './AnimatedCell';

interface GameGridProps {
  cells: boolean[][];
  width: number;
  cellSize: number;
  isDark: boolean;
  onCellClick: (row: number, col: number) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ 
  cells, 
  width, 
  cellSize, 
  isDark, 
  onCellClick 
}) => {
  const x: MotionValue = useMotionValue(0);
  const y: MotionValue = useMotionValue(0);

  return (
    <div className={`
      relative
      ${isDark ? 'bg-gray-800' : 'bg-white'} 
      rounded-lg
      w-full h-[calc(100vh-300px)]
      overflow-hidden
    `}>
      <div className="absolute w-[300%] h-[300%] left-[-100%] top-[-100%]">
        <motion.div 
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={{
            left: -width * cellSize,
            right: width * cellSize,
            top: -cells.length * cellSize,
            bottom: cells.length * cellSize
          }}
          className={`
            absolute
            left-1/2
            top-1/2
            grid gap-[1px] p-[1px] 
            rounded cursor-move
            origin-center
            ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
          `}
          style={{ 
            gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
            x,
            y,
            touchAction: 'none',
            transform: `translate(-50%, -50%)`
          }}
          onDoubleClick={() => {
            x.set(0);
            y.set(0);
          }}
        >
          {cells.map((row, i) => 
            row.map((cell, j) => (
              <AnimatedCell
                key={`${i}-${j}`}
                isAlive={cell}
                onClick={() => onCellClick(i, j)}
                size={cellSize}
                isDark={isDark}
              />
            ))
          )}
        </motion.div>
      </div>

      <div className={`
        absolute bottom-4 left-1/2 -translate-x-1/2
        text-xs text-gray-500 dark:text-gray-400 opacity-70
        pointer-events-none select-none
        bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full
        backdrop-blur-sm
      `}>
        Drag to move • Double click to center
      </div>
    </div>
  );
}; 