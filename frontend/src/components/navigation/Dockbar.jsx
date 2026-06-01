import React from 'react';
import { motion } from 'framer-motion';
import { tgHaptics } from "../../../services/telegram/index.js";

/**
 * @file Dockbar.jsx
 * @description Презентационный компонент нижней панели навигации.
 * Принимает готовый список элементов, управляет анимацией активного состояния и триггерит тактильный отклик.
 */

/**
 * @typedef {Object} DockbarItem
 * @property {string} id - Уникальный идентификатор вкладки
 * @property {React.ComponentType} icon - Компонент иконки для рендеринга
 */

/**
 * Компонент нижней панели навигации.
 * * @param {Object} props
 * @param {DockbarItem[]} props.items - Отфильтрованный массив элементов меню
 * @param {string} props.activeTab - Идентификатор текущей активной вкладки
 * @param {function(string): void} props.onTabChange - Колбэк при смене вкладки
 * @returns {React.JSX.Element}
 */
const Dockbar = ({ items = [], activeTab, onTabChange }) => {

  /**
   * Обрабатывает клик по вкладке, вызывая тактильный отклик Telegram.
   * @param {string} tabId - Идентификатор выбранной вкладки
   */
  const handleTabClick = (tabId) => {
    if (tabId !== activeTab) {
      tgHaptics.selection();
      onTabChange(tabId);
    }
  };

  if (!items.length) return null;

  // Базовый расчет: 60px на кнопку + паддинги и зазоры контейнера
  const containerWidth = items.length * 60 + (items.length - 1) * 8 + 16;

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50">
      <div
        className="flex items-center justify-between bg-white/30 backdrop-blur-2xl border border-white/40 rounded-full p-[8px] relative h-[56px] shadow-2xl transition-all duration-300"
        style={{ width: `${containerWidth}px` }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const neonStyle = item.id === 'settings'
            ? { filter: 'drop-shadow(0px 0px 12px rgba(191, 90, 242, 0.45))' }
            : { filter: 'drop-shadow(0px 0px 6px rgba(191, 90, 242, 0.8)) drop-shadow(0px 0px 15px rgba(191, 90, 242, 0.4))' };

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="relative w-[60px] h-[40px] flex items-center justify-center rounded-full outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-lg"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <Icon
                size={22}
                className={`relative z-10 transition-all duration-300 ${
                  isActive ? 'text-accent-purple' : 'text-slate-400'
                }`}
                style={isActive ? neonStyle : {}}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dockbar;