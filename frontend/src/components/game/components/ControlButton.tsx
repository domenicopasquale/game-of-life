import React from 'react';
import { motion } from 'framer-motion';

interface ControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export const ControlButton: React.FC<ControlButtonProps> = ({ 
  onClick, 
  disabled, 
  title, 
  className, 
  children 
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={className}
    title={title}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20
    }}
  >
    {children}
  </motion.button>
); 