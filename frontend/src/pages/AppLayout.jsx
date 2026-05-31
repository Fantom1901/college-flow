import React from 'react';
import useAppStore from '../store/useAppStore.js';

import TelegramSafeProvider from '../components/common/TelegramSafeProvider.jsx';
import AppInitializer from "../components/status/AppInitializer.jsx";
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
  const activeTab = useAppStore((state) => state.activeTab);

  const currentRole = user?.role;

  // Конфигурация доступных табов
  const tabsConfig = [
    { id: 'home', content: <HomeView user={user} isLoadingUser={false} /> },
    { id: 'exchange', content: <ExchangeView />, roles: ['student', 'leader'] },
    { id: 'reviews', content: <ReviewsView /> },
    { id: 'settings', content: <SettingsView /> },
  ];

  return (
    <AppInitializer>
      <TelegramSafeProvider>

        {/* Контентная зона */}
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

      </TelegramSafeProvider>
    </AppInitializer>
  );
};

export default AppLayout;