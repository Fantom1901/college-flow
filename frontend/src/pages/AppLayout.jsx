import React from 'react';
import useAppStore from '../store/useAppStore.js';

import AppLoader from '../components/status/AppLoader.jsx';
import AppError from '../components/status/AppError.jsx';
import AdminStub from '../components/status/AdminStub.jsx';
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
    <div className="min-h-screen w-full p-2 flex items-start justify-center">
      <main className="main-glass w-full max-w-md h-[91vh] rounded-[48px] overflow-hidden relative flex flex-col pt-6 px-4">

        <div className="flex-1 w-full relative overflow-hidden">
          {currentRole === 'admin' ? (
            <AdminDashboardView />
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
                    {/* Если у вкладки заданы роли — оборачиваем в гард, иначе рендерим просто так */}
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

        <div className="flex-shrink-0 pb-6 pt-2">
          <Dockbar role={currentRole} />
        </div>

      </main>
    </div>
  );
};

export default AppLayout;