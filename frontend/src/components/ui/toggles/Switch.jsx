import React from 'react';
import { motion } from 'framer-motion';

/**
 * Switch - Изолированный переключатель (тумблер)
 * @param {boolean} checked - Состояние (включен/выключен)
 * @param {function} onChange - Функция вызова при клике
 */
const Switch = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)} // Вызываем колбэк с инверсией
      className={`w-12 h-6 rounded-full p-0.5 outline-none transition-colors duration-300 flex ${
        checked ? 'bg-slate-950 justify-end' : 'bg-slate-200 justify-start'
      }`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="bg-white w-5 h-5 rounded-full shadow-md"
      />
    </button>
  );
};

export default Switch;