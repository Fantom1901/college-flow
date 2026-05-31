import React from 'react';
import { motion } from 'framer-motion';
import Typography from '../typography/Typography.jsx';

/**
 * GlassTabs - Стеклянный переключатель вкладок
 * @param {Array} tabs - Массив {id, label}
 * @param {string} activeTab - ID активной вкладки
 * @param {function} setActiveTab - Колбэк
 * @param {string} layoutId - Уникальный ID для анимации Framer Motion
 */
const GlassTabs = ({ tabs, activeTab, setActiveTab, layoutId = "active-exchange-tab" }) => {
  return (
    <div className="w-full main-glass rounded-full p-[4px] flex items-center justify-between relative h-[48px] shadow-2xl border border-white/20">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="relative flex-1 h-full flex items-center justify-center rounded-full outline-none transition-colors duration-300 z-10"
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-white rounded-full shadow-md"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative z-20 transition-all duration-300 ${isActive ? 'scale-102' : ''}`}>
              <Typography
                variant="badge"
                className={isActive ? 'text-slate-900' : 'text-slate-400'}
              >
                {tab.label}
              </Typography>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default GlassTabs;