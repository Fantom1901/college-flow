import React, { useEffect } from 'react';
import { Home, StarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import useAppStore from '../store/useAppStore';
import { ExchangeIcon } from './icons/ExchangeIcon';
import { SettingsIcon } from './icons/SetingsIcon.jsx';
import { tgHaptics } from "../../services/telegram/index.js";

/**
 * Функция строгого расчёта ширины докбара на основе количества вкладок.
 * Выявленный шаг изменения составляет 70px, базируясь на пропорциях 4 кнопок = 280px.
 * * @param {number} count - Количество активных вкладок
 * @returns {string} - Значение ширины для инлайн-стилей
 */
const getDockbarWidth = (count) => {
  if (count === 4) return '280px';
  if (count === 3) return '210px';
  if (count === 2) return '140px';
  return '80px'; // Для 1 кнопки (админ)
};

const Dockbar = ({ role }) => {
  const { activeTab, setActiveTab } = useAppStore();

  // Полный список всех возможных вкладок приложения
  const allItems = [
    { id: 'home', icon: Home },
    { id: 'exchange', icon: ExchangeIcon },
    { id: 'reviews', icon: StarIcon },
    { id: 'settings', icon: SettingsIcon },
  ];

  // Фильтруем табы строго на основе переданной роли
  const menuItems = allItems.filter((item) => {
    if (role === 'admin') {
      return item.id === 'settings'; // У админа только настройки
    }
    if (role === 'curator') {
      return item.id !== 'exchange'; // Куратор видит всё, кроме обменов
    }
    // Студент и Староста видят абсолютно все вкладки
    return true;
  });

  // Защитный эффект: если текущий активный таб отсутствует в разрешенных для этой роли,
  // сбрасываем пользователя на первую доступную вкладку.
  useEffect(() => {
    const isTabAllowed = menuItems.some((item) => item.id === activeTab);
    if (!isTabAllowed && menuItems.length > 0) {
      setActiveTab(menuItems[0].id);
    }
  }, [activeTab, menuItems, setActiveTab]);

  const handleTabClick = (tabId) => {
    if (tabId !== activeTab) {
      tgHaptics.selection();
      setActiveTab(tabId);
    }
  }

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50">
      <div
        className="flex items-center justify-between bg-white/30 backdrop-blur-2xl border border-white/40 rounded-full p-[8px] relative h-[56px] shadow-2xl transition-all duration-300"
        style={{ width: getDockbarWidth(menuItems.length) }}
      >
        {menuItems.map((item) => {
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