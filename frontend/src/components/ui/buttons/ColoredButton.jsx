import React from 'react';
import { motion } from 'framer-motion';

const ActionButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-purple-600/40 border-purple-500/30 text-white',
    success: 'bg-emerald-600/30 border-emerald-500/20 text-emerald-100',
    warning: 'bg-amber-600/30 border-amber-500/20 text-amber-100',
    danger: 'bg-rose-600/30 border-rose-500/20 text-rose-100',
    neutral: 'bg-white/5 border-white/10 text-white/80'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`py-2.5 px-4 border rounded-xl text-[11px] font-bold uppercase italic tracking-wider transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default ActionButton;