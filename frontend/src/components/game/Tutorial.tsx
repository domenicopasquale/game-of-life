import { motion, AnimatePresence } from 'framer-motion';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TutorialProps {
  isDark: boolean;
  onClose: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ isDark, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <div className={`
        rounded-lg shadow-lg p-4 max-w-sm
        ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'}
      `}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Quick Tips</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          <li>• Click cells to toggle them alive/dead</li>
          <li>• Space to play/pause</li>
          <li>• Right arrow for next generation</li>
          <li>• Try different patterns from the selector</li>
        </ul>
      </div>
    </motion.div>
  </AnimatePresence>
); 