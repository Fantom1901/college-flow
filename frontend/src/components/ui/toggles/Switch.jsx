import React from 'react';
import { motion } from 'framer-motion';
import {tgHaptics} from "../../../../services/telegram/index.js";

/**
 * Switch - Изолированный переключатель (тумблер)
 * @param {boolean} checked - Состояние (включен/выключен)
 * @param {function} onChange - Функция вызова при клике
 */
const Switch = ({ checked, onChange }) => {

  const handleToggle = () => {
    const newState = !checked;

    // Вибрация подтверждения при включении
    tgHaptics.selection();

    onChange(newState);

  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-12 h-6 rounded-full p-0.5 outline-none transition-colors duration-300 flex ${
        // Если включен — загорается зеленым, если выключен — оригинал (bg-slate-200)
        checked ? 'bg-accent-green justify-end' : 'bg-slate-200 justify-start'
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