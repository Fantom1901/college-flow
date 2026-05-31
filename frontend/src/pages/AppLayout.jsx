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

  // Безопасная проверка поддержки без вызова несуществующих функций
  const isSupported = typeof viewport !== 'undefined' && viewport.mount ? 'ДА' : 'НЕТ';

  // Вытаскиваем числовой сигнал отступа под контент ТГ (три точки/закрыть) с помощью хука useSignal
  // В режиме разработки (IS_DEV) viewport не монтируется, поэтому ставим фолбек в 0
  //const contentTopInset = !IS_DEV ? useSignal(viewport.contentSafeAreaInsetTop) : 0;

  if (serverStatus === 'loading' || serverStatus === 'offline') return <AppLoader />;
  if (serverStatus === 'error') return <AppError />;

  const currentRole = user?.role;

  const tabsConfig = [
    { id: 'home', content: <HomeView user={user} isLoadingUser={false} /> },
    { id: 'exchange', content: <ExchangeView />, roles: ['student', 'leader'] },
    { id: 'reviews', content: <ReviewsView /> },
    { id: 'settings', content: <SettingsView /> },
  ];

  return (
    <div className="h-screen w-full p-3 flex items-center justify-center overflow-hidden">

      {/* ВРЕМЕННАЯ ПЛАШКА ДЛЯ ОТЛАДКИ НА ТЕЛЕФОНЕ */}
      <div className="fixed top-2 left-2 z-[9999] bg-black/90 text-green-400 p-2 rounded text-[10px] font-mono border border-green-500 pointer-events-none">
        <div>Supported: {isSupported}</div>
        <div>Mounted: {isMounted}</div>
        <div>ContentTopInset: {contentTopInset}px</div>
      </div>

      <main
        className="main-glass w-full max-w-md h-full max-h-[85vh] rounded-[40px] overflow-hidden relative flex flex-col px-4 shadow-2xl border border-white/10"
        style={{
          /* Если сигнал ТГ вернул отступ больше нуля (мы на мобилке в ТГ),
             сдвигаем контент на эту высоту плюс 12px зазора.
             Если мы в браузере или деве, ставим дефолтные 24px.
          */
          paddingTop: contentTopInset > 0 ? `${contentTopInset + 12}px` : '24px'
        }}
      >

        {/* Контентная зона */}
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