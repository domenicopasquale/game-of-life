import { motion } from 'framer-motion';
import { 
  ClockIcon,  // per generazioni
  UsersIcon,  // per popolazione
  TableCellsIcon  // per dimensione griglia
} from '@heroicons/react/24/outline';

export const GridStats = ({ cells, generation, population }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-3 text-xs"
  >
    <div className={`flex items-center gap-1 text-gray-500 dark:text-gray-400`}>
      <ClockIcon className="w-3.5 h-3.5" title="Generation" />
      <span>{generation}</span>
    </div>

    <div className={`flex items-center gap-1 text-gray-500 dark:text-gray-400`}>
      <UsersIcon className="w-3.5 h-3.5" title="Population" />
      <span>{population}</span>
    </div>

    <div className={`flex items-center gap-1 text-gray-500 dark:text-gray-400`}>
      <TableCellsIcon className="w-3.5 h-3.5" title="Grid Size" />
      <span>{cells[0].length}×{cells.length}</span>
    </div>
  </motion.div>
); 