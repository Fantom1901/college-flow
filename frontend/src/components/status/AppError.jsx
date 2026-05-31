import React from 'react';
import GlassCard from '../ui/cards/GlassCard.jsx';
import Typography from '../ui/typography/Typography.jsx';

const AppError = () => (
  <div className="min-h-screen w-full flex items-center justify-center p-4">
    <GlassCard variant="form" className="border-red-500/30 items-center text-center">
      <Typography variant="h1" className="text-red-400 mb-1">
        Ошибка подключения
      </Typography>
      <Typography variant="body" className="text-red-400/80">
        Не удалось загрузить профиль. Проверьте соединение или попробуйте позже.
      </Typography>
    </GlassCard>
  </div>
);

export default AppError;