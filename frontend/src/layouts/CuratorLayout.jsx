import React from 'react';
import TelegramSafeProvider from '../providers/TelegramSafeProvider.jsx';
import AppInitializer from "../components/status/AppInitializer.jsx";

const CuratorLayout = () => {
  return (
    <AppInitializer>
      <TelegramSafeProvider>
        <div className="flex-1 w-full flex flex-col items-center justify-center p-4 text-white">
          <h2 className="text-xl font-bold mb-2">Панель Куратора</h2>
          <p className="text-gray-400 text-center">
            Здесь будет находиться многоступенчатый конструктор группы.
          </p>
        </div>
      </TelegramSafeProvider>
    </AppInitializer>
  );
};

export default CuratorLayout;