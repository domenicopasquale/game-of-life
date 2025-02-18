import { motion } from 'framer-motion';
import { 
  ClockIcon,
  UsersIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

interface GridStatsProps {
  cells: boolean[][];
  generation: number;
  population: number;
  isDark: boolean;
}

export const GridStats: React.FC<GridStatsProps> = ({ cells, generation, population, isDark }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-3 text-xs"
  >
    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
      Generation: <span className="font-medium">{generation}</span>
    </div>
    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
      Population: <span className="font-medium">{population}</span>
    </div>
  </motion.div>
); 