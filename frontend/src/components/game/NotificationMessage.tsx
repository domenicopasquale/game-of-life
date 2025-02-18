import { motion } from 'framer-motion';

interface NotificationMessageProps {
  message: string;
  type: 'success' | 'error';
}

export const NotificationMessage: React.FC<NotificationMessageProps> = ({ message, type }) => {
  const bgColor = type === 'success' 
    ? 'bg-green-100 dark:bg-green-900' 
    : 'bg-red-100 dark:bg-red-900';
  
  const textColor = type === 'success'
    ? 'text-green-800 dark:text-green-200'
    : 'text-red-800 dark:text-red-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-sm`}
    >
      {message}
    </motion.div>
  );
}; 