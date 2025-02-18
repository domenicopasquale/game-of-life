import { motion } from 'framer-motion';

interface AnimatedCellProps {
  isAlive: boolean;
  onClick: () => void;
  size: number;
  isDark: boolean;
}

export const AnimatedCell: React.FC<AnimatedCellProps> = ({ 
  isAlive, 
  onClick, 
  size, 
  isDark 
}) => (
  <motion.div
    onClick={onClick}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ 
      scale: 1, 
      opacity: 1,
      backgroundColor: isAlive
        ? isDark ? 'rgb(14, 165, 233)' : 'rgb(2, 132, 199)'
        : isDark ? 'rgb(31, 41, 55)' : 'rgb(255, 255, 255)'
    }}
    exit={{ scale: 0.8, opacity: 0 }}
    transition={{ 
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 0.8,
      duration: 0.15
    }}
    className={`cell-transition ${
      !isAlive && !isDark ? 'border border-gray-200' : ''
    }`}
    style={{
      width: `${size}px`,
      height: `${size}px`
    }}
    whileHover={{ 
      scale: 1.1,
      transition: { duration: 0.1 }
    }}
    whileTap={{ 
      scale: 0.95,
      transition: { duration: 0.1 }
    }}
  />
); 