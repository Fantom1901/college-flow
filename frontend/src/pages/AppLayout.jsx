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

const AppLayout = () => {
  const user = useAppStore((state) => state.user);
  const serverStatus = useAppStore((state) => state.serverStatus);
  const activeTab = useAppStore((state) => state.activeTab);

  // Читаем сигналы напрямую через хук
  const contentTopInset = useSignal(viewport.contentSafeAreaInsetTop) || 0;

  if (serverStatus === 'loading' || serverStatus === 'offline') return <AppLoader />;
  if (serverStatus === 'error') return <AppError />;

  const currentRole = user?.role;

  const tabsConfig = [
    { id: 'home', content: <HomeView user={user} isLoadingUser={false} /> },
    { id: 'exchange', content: <ExchangeView />, roles: ['student', 'leader'] },
    { id: 'reviews', content: <ReviewsView /> },
    { id: 'settings', content: <SettingsView /> },
  ];

  // Вычисляем точный отступ сверху для всего интерфейса приложения
  const topPadding = contentTopInset > 0 ? `${contentTopInset + 32}px` : '24px';

  return (
    /* ФИКС: Паддинг сверху переезжает на самый корневой контейнер.
       Теперь всё, что внутри (включая стеклянный main), физически начнется ниже кнопок ТГ! */
    <div
      className="h-screen w-full p-3 flex flex-col justify-end overflow-hidden"
      style={{ paddingTop: topPadding }}
    >

      {/* КАРТОЧКА: Теперь она занимает ВСЁ доступное ей пространство БЕЗ вылета в стратосферу,
          так как родитель сверху её ограничил своим paddingTop. Скругления [40px] теперь встанут идеально! */}
      <main className="main-glass w-full max-w-md flex-1 rounded-[40px] overflow-hidden relative flex flex-col px-4 shadow-2xl border border-white/10">

        {/* Контентная зона (чистая, без распорок, занимает весь main) */}
        <div className="flex-1 w-full relative overflow-hidden mt-4">
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