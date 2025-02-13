import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export const NotificationMessage = ({ message, type = 'success' }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`mb-4 p-4 rounded-lg flex items-center gap-2
          ${type === 'success' 
            ? 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200'
            : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
      >
        {type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
        {message}
      </motion.div>
    )}
  </AnimatePresence>
); 