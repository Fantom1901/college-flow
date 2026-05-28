import React from 'react';
import { motion } from 'framer-motion';

export const ExchangeTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'incoming', label: 'Входящие' },
    { id: 'outgoing', label: 'Исходящие' },
    { id: 'history', label: 'История' },
  ];

  return (
    <div className="w-full main-glass rounded-full p-[4px] flex items-center justify-between relative h-[48px] shadow-2xl border border-white/20">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex-1 h-full flex items-center justify-center rounded-full outline-none transition-colors duration-300 z-10"
          >
            {/* Плавающая пилюля активного таба */}
            {isActive && (
              <motion.div
                layoutId="active-exchange-tab"
                className="absolute inset-0 bg-white rounded-full shadow-md"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}

            {/* Текст вкладки */}
            <span
              className={`relative z-20 font-black text-[12px] uppercase italic tracking-wider transition-all duration-300 ${
                isActive ? 'text-slate-900 scale-102' : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ExchangeTabs;