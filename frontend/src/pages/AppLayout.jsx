import React from 'react';
import { viewport, useSignal } from '@tma.js/sdk-react';
import useAppStore from '../store/useAppStore.js';

import AppLoader from '../components/status/AppLoader.jsx';
import AppError from '../components/status/AppError.jsx';
import Dockbar from "../components/Dockbar.jsx";
import AccessGuard from '../components/AccessGuard.jsx';

// Импорт контента вкладок
import HomeView from '../views/common/HomeViews.jsx';
import ExchangeView from '../views/ExchangeView';
import SettingsView from '../views/SettingsView';
import ReviewsView from '../views/common/ReviewsView.jsx';
import AdminDashboardView from '../views/admin/AdminDashboardView.jsx';
import { IS_DEV } from '../config.js';

const AppLayout = () => {
  const user = useAppStore((state) => state.user);
  const serverStatus = useAppStore((state) => state.serverStatus);
  const activeTab = useAppStore((state) => state.activeTab);

  // Читаем сигналы напрямую через хук
  const contentTopInset = useSignal(viewport.contentSafeAreaInsetTop) || 0;
  const isMounted = useSignal(viewport.isMounted) ? 'ДА' : 'НЕТ';

  // Безопасная проверка поддержки
  const isSupported = typeof viewport !== 'undefined' && viewport.mount ? 'ДА' : 'НЕТ';

  if (serverStatus === 'loading' || serverStatus === 'offline') return <AppLoader />;
  if (serverStatus === 'error') return <AppError />;

  const currentRole = user?.role;

  const tabsConfig = [
    { id: 'home', content: <HomeView user={user} isLoadingUser={false} /> },
    { id: 'exchange', content: <ExchangeView />, roles: ['student', 'leader'] },
    { id: 'reviews', content: <ReviewsView /> },
    { id: 'settings', content: <SettingsView /> },
  ];

  // Вычисляем точную высоту распорки
  const spacerHeight = contentTopInset > 0 ? `${contentTopInset + 16}px` : '24px';

  return (
    <div className="h-screen w-full p-3 flex flex-col justify-end overflow-hidden">

      {/* ВРЕМЕННАЯ ПЛАШКА ДЛЯ ОТЛАДКИ НА ТЕЛЕФОНЕ */}
      <div className="fixed top-2 left-2 z-[9999] bg-black/90 text-green-400 p-2 rounded text-[10px] font-mono border border-green-500 pointer-events-none">
        <div>Supported: {isSupported}</div>
        <div>Mounted: {isMounted}</div>
        <div>ContentTopInset: {contentTopInset}px</div>
      </div>

      <main className="main-glass w-full max-w-md h-full rounded-[40px] overflow-hidden relative flex flex-col px-4 shadow-2xl border border-white/10">

        {/* ЖЕЛЕЗОБЕТОННАЯ РАСПОРКА: Физически сдвигает всё, что ниже, из-под плашки ТГ */}
        <div
          className="w-full flex-shrink-0"
          style={{ height: spacerHeight }}
        />

        {/* Контентная зона (теперь чистый относительный контейнер без инлайн паддингов) */}
        <div className="flex-1 w-full relative overflow-hidden">
          {currentRole === 'admin' ? (
            <div className="absolute inset-0 w-full h-full flex flex-col overflow-y-auto pb-4">
              <AdminDashboardView />
            </div>
          ) : (
            tabsConfig.map(({ id, content, roles }) => {
              const isActive = activeTab === id;

              return (
                <div
                  key={id}
                  className={`absolute inset-0 w-full h-full flex flex-col overflow-y-auto transition-opacity duration-300 ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <div className="flex-1 pb-4">
                    {roles ? (
                      <AccessGuard allowedRoles={roles}>{content}</AccessGuard>
                    ) : (
                      content
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Навигация (Докбар) зафиксирована снизу */}
        <div className="flex-shrink-0 pb-5 pt-2 z-20">
          <Dockbar role={currentRole} />
        </div>

      </main>
    </div>
  );
};

export default AppLayout;