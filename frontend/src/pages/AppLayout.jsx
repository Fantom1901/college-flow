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
      // Если дев-режим, возвращаем заглушку сразу
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

  // В дев-режиме игнорируем ошибку, чтобы интерфейс не падал
  if (error && !IS_DEV) return (
    <div className="p-6 text-red-500 bg-white/20 main-glass rounded-3xl m-4">
      Ошибка загрузки: {error.message}
    </div>
  );

  return (
    <div className="min-h-screen w-full p-2 flex items-center justify-center">
      <main className="main-glass w-full max-w-md min-h-[91vh] rounded-[48px] overflow-hidden relative flex flex-col pt-12 pb-28 px-4 transition-all duration-1000">

        {/*<div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/10 rounded-full" />*/}

        <div className="flex-1">
          {activeTab === 'home' && (
            <HomeView user={user} isLoadingUser={isLoading} />
          )}
          {activeTab === 'exchange' && <ExchangeView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>

        {/* Теперь он живет здесь */}
        <Dockbar />
      </main>
    </div>
  );
};

export default AppLayout;