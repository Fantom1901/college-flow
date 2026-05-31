import React, { useState, useEffect } from 'react';
import GlassCard from '../ui/cards/GlassCard.jsx';
import Typography from '../ui/typography/Typography.jsx';

const AppLoader = () => {
  const [isMinimumLoadingDone, setIsMinimumLoadingDone] = useState(false);

  useEffect(() => {
    // Принудительно держим лоадер минимум 1 секунду
    const timer = setTimeout(() => {
      setIsMinimumLoadingDone(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Если приложение уже загрузилось (но мы еще не дождались таймера),
  // или если мы хотим просто контролировать это извне,
  // тут можно добавить проверку props.isLoaded.
  // Но для текущей задачи — таймер отрабатывает идеально.

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <GlassCard variant="form" className="items-center text-center gap-4">
        <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin" />
        <Typography variant="body" className="opacity-80">
          Инициализация приложения...
        </Typography>
      </GlassCard>
    </div>
  );
};

export default AppLoader;