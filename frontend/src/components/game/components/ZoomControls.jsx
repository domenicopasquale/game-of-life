import { motion } from 'framer-motion';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

export const ZoomControls = ({ onZoomIn, onZoomOut, isDark }) => (
  <div className="flex gap-2">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onZoomOut}
      className={`p-2 rounded-lg transition-colors
        ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
    >
      <MagnifyingGlassMinusIcon className="w-5 h-5" />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onZoomIn}
      className={`p-2 rounded-lg transition-colors
        ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
    >
      <MagnifyingGlassPlusIcon className="w-5 h-5" />
    </motion.button>
  </div>
); 