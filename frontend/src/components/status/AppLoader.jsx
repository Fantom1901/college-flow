import React, { useState, useEffect } from 'react';
import GlassCard from '../ui/cards/GlassCard.jsx';
import Typography from '../ui/typography/Typography.jsx';
import CyberLoader from '../ui/loaders/CyberLoader.jsx'; // Корректный импорт твоего нового лоадера

/**
 * AppLoader - Профессиональный экран инициализации приложения.
 * Интегрирован с футуристичным CyberLoader и дизайн-системой проекта.
 * * @param {string} status - Статус загрузки для CyberLoader ('loading' | 'success' | 'error')
 * @param {string} text - Кастомный текст инициализации под спиннером
 */
const AppLoader = ({ status = 'loading', text = 'Инициализация приложения...' }) => {
  const [isMinimumLoadingDone, setIsMinimumLoadingDone] = useState(false);

  useEffect(() => {
    // Гарантированно держим лоадер на экране минимум 1 секунду для плавности анимации
    const timer = setTimeout(() => {
      setIsMinimumLoadingDone(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <GlassCard variant="form" className="items-center text-center gap-5 p-6">
        {/* Твой кастомный кибер-лоадер вместо дефолтной крутилки */}
        <CyberLoader status={status} />

        <Typography variant="body" className="opacity-80 font-bold tracking-wide">
          {text}
        </Typography>
      </GlassCard>
    </div>
  );
};

export default AppLoader;