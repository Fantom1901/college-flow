import React from 'react';
import { motion } from 'framer-motion';

/**
 * PrimaryButton - Главная кнопка интерфейса
 * @param {React.ReactNode} children - Текст кнопки
 * @param {boolean} [loading=false] - Стейт загрузки
 * @param {function} onClick - Колбэк клика
 */
const PrimaryButton = ({ children, loading = false, onClick, ...props }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className="w-full mt-2 py-3.5 bg-slate-950 text-white font-black italic tracking-wide rounded-2xl shadow-lg border border-white/10 outline-none flex justify-center items-center disabled:opacity-70"
      {...props}
    >
      {loading ? 'СОХРАНЕНИЕ...' : children}
    </motion.button>
  );
};

export default PrimaryButton;