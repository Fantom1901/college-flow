import React from 'react';
import { motion } from 'framer-motion';

/**
 * ColoredButton - кнопка с поддержкой акцентных цветов
 * @param {string} variant - цвет из theme (например: 'purple', 'red', 'emerald')
 * @param {boolean} filled - если true, заливка цветом, если false - полупрозрачная рамка
 */
const ColoredButton = ({
                         children,
                         variant = 'purple',
                         filled = true,
                         onClick,
                         className = '',
                         ...props
                       }) => {
  // Маппинг твоих цветов для классов Tailwind
  const styles = {
    purple: filled ? 'bg-accent-purple/40 border-accent-purple/30' : 'bg-transparent border-accent-purple/30',
    red: filled ? 'bg-accent-red/40 border-accent-red/30' : 'bg-transparent border-accent-red/30',
    green: filled ? 'bg-accent-green/40 border-accent-green/30' : 'bg-transparent border-accent-green/30',
    yellow: filled ? 'bg-accent-yellow/40 border-accent-yellow/30' : 'bg-transparent border-accent-yellow/30',
    blue: filled ? 'bg-accent-blue/40 border-accent-blue/30' : 'bg-transparent border-accent-blue/30',
    white: filled ? 'bg-white/10 border-white/10' : 'bg-transparent border-white/10',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default ColoredButton;