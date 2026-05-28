import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import useAppStore from '../store/useAppStore.js';
import HomeView from '../components/views/HomeViews.jsx';
import ExchangeView from '../components/views/ExchangeView';
import SettingsView from '../components/views/SettingsView';
import ReviewsView from '../components/views/ReviewsView';
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
      {/* Основной контейнер с фиксированной высотой */}
      <main className="main-glass w-full max-w-md h-[91vh] rounded-[48px] overflow-hidden relative flex flex-col pt-6 px-4">

        {/* Контейнер для вкладок: flex-1 заставляет его занимать всё место ДО докбара */}
        <div className="flex-1 w-full relative overflow-hidden">

          {/* HOME */}
          <div
            className={`absolute inset-0 w-full h-full flex flex-col overflow-y-auto ${
              activeTab === 'home'
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="flex-1 pb-4"> {/* pb-4 дает небольшой отступ, чтобы контент не прилипал к краю */}
              <HomeView user={user} isLoadingUser={isLoading} />
            </div>
          </div>

          {/* EXCHANGE */}
          <div
            className={`absolute inset-0 w-full h-full flex flex-col overflow-y-auto ${
              activeTab === 'exchange'
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="flex-1 pb-4">
              <ExchangeView />
            </div>
          </div>

          {/* REVIEWS */}
          <div
            className={`absolute inset-0 w-full h-full flex flex-col overflow-y-auto transition-opacity duration-300 ${
              activeTab === 'reviews'
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="flex-1 pb-4">
              <ReviewsView />
            </div>
          </div>

          {/* SETTINGS */}
          <div
            className={`absolute inset-0 w-full h-full flex flex-col overflow-y-auto ${
              activeTab === 'settings'
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="flex-1 pb-4">
              <SettingsView />
            </div>
          </div>

        </div>

        {/* Докбар: flex-shrink-0 запрещает ему сжиматься, он всегда будет виден */}
        <div className="flex-shrink-0 pb-6 pt-2">
          <Dockbar />
        </div>

      </main>
    </div>
  );
};

export default AppLayout;