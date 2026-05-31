import React from 'react';
import { motion } from 'framer-motion';
import { tgHaptics } from "../../../../services/telegram/index.js"; // Адаптируй путь к своему хэптику

/**
 * TabSelector - Универсальный сегментированный переключатель (Pill Selector)
 * @param {Array<{id: string|number, label: string}>} options - Массив вкладок
 * @param {string|number} value - Активный id
 * @param {function} onChange - Колбэк смены вкладки
 * @param {string} [layoutId="active-pill"] - Уникальный ID для анимации Framer Motion
 */
const TabSelector = ({ options, value, onChange, layoutId = "active-pill" }) => {
  const handleSelect = (id) => {
    if (value !== id) {
      tgHaptics.selection();
      onChange(id);
    }
  };

  return (
    <div className="flex relative bg-slate-950/20 p-1 rounded-2xl border border-white/10 overflow-hidden w-full">
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(opt.id)}
            className={`flex-1 py-2 text-xs font-extrabold italic rounded-xl relative outline-none transition-colors duration-300 ${
              isActive ? 'text-slate-950' : 'text-white/60'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-white rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabSelector;