import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tgHaptics } from "../../../../services/telegram/index.js";

/**
 * Counter - Счётчик с плавающей анимацией цифр
 * @param {number} value - Текущее значение
 * @param {function} onChange - Колбэк изменения значения
 * @param {number} [min=1] - Минимальный порог
 * @param {number} [max=5] - Максимальный порог
 * @param {string} [suffix="чел."] - Суффикс после цифры
 */
const Counter = ({ value, onChange, min = 1, max = 5, suffix = "чел." }) => {
  const handleIncrement = () => {
    if (value >= max) {
      tgHaptics.notification('warning');
      return;
    }
    tgHaptics.selection();
    onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value <= min) {
      tgHaptics.notification('warning');
      return;
    }
    tgHaptics.selection();
    onChange(value - 1);
  };

  return (
    <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl shadow-lg border border-white/20 w-full">
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        disabled={value <= min}
        onClick={handleDecrement}
        className="w-9 h-9 rounded-xl bg-slate-100 font-black text-slate-900 flex items-center justify-center disabled:opacity-20 outline-none"
      >
        -
      </motion.button>

      <div className="h-6 overflow-hidden relative w-20 flex justify-center items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="font-black text-slate-900 italic text-base absolute"
          >
            {value} {suffix}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        disabled={value >= max}
        onClick={handleIncrement}
        className="w-9 h-9 rounded-xl bg-slate-100 font-black text-slate-900 flex items-center justify-center disabled:opacity-20 outline-none"
      >
        +
      </motion.button>
    </div>
  );
};

export default Counter;