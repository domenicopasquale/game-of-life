import { motion } from 'framer-motion';
import { CursorArrowRaysIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

export const Tutorial = ({ isDark }) => (
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
      <div className="flex items-center gap-2">
        <CursorArrowRaysIcon className={`w-4 h-4 ${isDark ? 'text-primary-400' : 'text-primary-500'}`} />
        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
          Select cells or choose a pattern
        </span>
      </div>

      <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'}`}>•</span>

      <div className="flex items-center gap-2">
        <PlayCircleIcon className={`w-4 h-4 ${isDark ? 'text-primary-400' : 'text-primary-500'}`} />
        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
          Press play
        </span>
      </div>

      <motion.div
        className="absolute -right-1 -top-1"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1] 
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-2 h-2 bg-primary-400 rounded-full" />
      </motion.div>
    </motion.div>
  </div>
); 