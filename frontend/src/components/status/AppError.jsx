import React from 'react';

const AppError = () => (
  <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="p-6 text-red-400 bg-black/40 border border-red-500/30 main-glass rounded-3xl max-w-md text-center">
          <h3 className="text-lg font-bold mb-2">Ошибка подключения</h3>
          <p className="text-sm opacity-80">Не удалось загрузить профиль. Проверьте соединение или попробуйте позже.</p>
      </div>
  </div>
);

export default AppError;