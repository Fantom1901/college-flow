import React from 'react';

const AppLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center p-4">
    <div className="main-glass p-8 rounded-3xl text-white text-center flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      <p className="text-sm font-medium tracking-wide opacity-80">Инициализация приложения...</p>
    </div>
  </div>
);

export default AppLoader;