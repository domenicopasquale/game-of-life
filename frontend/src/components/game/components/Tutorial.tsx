import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface TutorialProps {
  isDark: boolean;
  onClose: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ isDark }) => (
  <div className="fixed inset-x-0 bottom-20 flex justify-center z-50 pointer-events-none">
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className={`
        px-6 py-3 rounded-lg
        ${isDark 
          ? 'bg-gray-800/90 border border-gray-700/50' 
          : 'bg-white/90 border border-gray-200/50'
        }
        shadow-lg
        flex items-center gap-6
        text-sm
        backdrop-blur-md
        pointer-events-auto
      `}
    >
      <div className="flex items-start gap-3">
        <InformationCircleIcon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
        <div>
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            How to play
          </h3>
          <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>• Click cells to toggle them alive/dead</li>
            <li>• Use the pattern selector to add predefined patterns</li>
            <li>• Press play to start the simulation</li>
            <li>• Adjust speed with the slider</li>
            <li>• Use zoom controls to resize the grid</li>
          </ul>
        </div>
      </div>
    </motion.div>
  </div>
); 