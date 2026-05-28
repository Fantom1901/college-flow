import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import useAppStore from '../store/useAppStore.js';
import HomeView from '../components/views/HomeViews.jsx';
import ExchangeView from '../components/views/ExchangeView';
import SettingsView from '../components/views/SettingsView';
import Dockbar from "../components/Dockbar.jsx";
import { IS_DEV, MOCK_USER } from '../config';

const AppLayout = () => {
  const { setUser, activeTab } = useAppStore();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      if (IS_DEV) return MOCK_USER;
      const data = await usersApi.getMe();
      return data;
    },
    retry: IS_DEV ? false : 1,
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (error && !IS_DEV) return (
    <div className="p-6 text-red-500 bg-white/20 main-glass rounded-3xl m-4">
      Ошибка загрузки: {error.message}
    </div>
  );

  return (
    <div className="min-h-screen w-full p-2 flex items-start justify-center">
      <main className="main-glass w-full max-w-md min-h-[91vh] rounded-[48px] overflow-hidden relative flex flex-col pt-6 pb-28 px-4 transition-all duration-1000">
        <div className="flex-1 w-full relative"> {/* Добавили relative, чтобы абсолютные слои не расползались */}

          {/* Вкладка HOME
          Вместо hidden используем opacity и pointer-events.
          Компонент сохраняет свои физические размеры, поэтому стек карточек и анимации не багаются.
        */}
          <div
            className={`w-full h-full flex flex-col transition-opacity duration-300 ${
              activeTab === 'home' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute inset-0'
            }`}
          >
            <HomeView user={user} isLoadingUser={isLoading} />
          </div>

          {/* Вкладка EXCHANGE */}
          <div
            className={`w-full h-full flex flex-col transition-opacity duration-300 ${
              activeTab === 'exchange' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute inset-0'
            }`}
          >
            <ExchangeView />
          </div>

          {/* Вкладка SETTINGS */}
          <div
            className={`w-full h-full flex flex-col transition-opacity duration-300 ${
              activeTab === 'settings' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute inset-0'
            }`}
          >
            <SettingsView />
          </div>

        </div>
        <Dockbar />
      </main>
    </div>
  );
};

export default AppLayout;