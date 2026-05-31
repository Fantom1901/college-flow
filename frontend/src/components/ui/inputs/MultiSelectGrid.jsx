import React from 'react';
import { motion } from 'framer-motion';
import { tgHaptics } from "../../../../services/telegram/index.js";

/**
 * MultiSelectGrid - Сетка кнопок с множественным выбором
 * @param {Array<{id: number|string, label: string}>} items - Полный список элементов
 * @param {Array<number|string>} selectedIds - Массив выбранных id
 * @param {function} onChange - Функция обновления выбранных элементов
 * @param {string} [gridClass="grid grid-cols-6 gap-1.5"] - Класс сетки (дефолт под 6 дней)
 */
const MultiSelectGrid = ({ items, selectedIds, onChange, gridClass = "grid grid-cols-6 gap-1.5" }) => {
  const handleToggle = (id) => {
    tgHaptics.selection();
    const updated = selectedIds.includes(id)
      ? selectedIds.filter(item => item !== id)
      : [...selectedIds, id].sort((a, b) => a - b);
    onChange(updated);
  };

  return (
    <div className={`${gridClass} bg-slate-950/20 p-1.5 rounded-2xl border border-white/10 relative overflow-hidden w-full`}>
      {items.map((item) => {
        const isActive = selectedIds.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleToggle(item.id)}
            className={`h-10 text-xs font-black italic rounded-xl relative outline-none transition-colors duration-300 ${
              isActive ? 'text-slate-950' : 'text-white/40'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={`active-grid-pill-${item.id}`}
                className="absolute inset-0 bg-white rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
              />
            )}
            <motion.span className="relative z-10 block" whileTap={{ scale: 0.85 }}>
              {item.label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
};

export default MultiSelectGrid;