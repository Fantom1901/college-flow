import React from 'react';
import useAppStore from '../store/useAppStore.js';
import HomeView from '../views/common/HomeViews.jsx';
import ExchangeView from '../views/ExchangeView';
import SettingsView from '../views/SettingsView';
import ReviewsView from '../views/common/ReviewsView.jsx';
import AccessGuard from '../components/AccessGuard.jsx';
import Dockbar from "../components/Dockbar.jsx";

const AppLayout = () => {
  // Забираем всё необходимое из Zustand стора
  const user = useAppStore((state) => state.user);
  const serverStatus = useAppStore((state) => state.serverStatus);
  const activeTab = useAppStore((state) => state.activeTab);

  // 1. Экран загрузки (пока initApp собирает данные, вьюхи не монтируются, сеть не триггерится)
  if (serverStatus === 'loading' || serverStatus === 'offline') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="main-glass p-8 rounded-3xl text-white text-center flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-wide opacity-80">Инициализация приложения...</p>
        </div>
      </div>
    );
  }

  // 2. Экран критической ошибки сервера
  if (serverStatus === 'error') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="p-6 text-red-400 bg-black/40 border border-red-500/30 main-glass rounded-3xl max-w-md text-center">
          <h3 className="text-lg font-bold mb-2">Ошибка подключения</h3>
          <p className="text-sm opacity-80">Не удалось загрузить профиль. Проверьте соединение или попробуйте позже.</p>
        </div>
      </div>
    );
  }

  const currentRole = user?.role;

  return (
    <div className="min-h-screen w-full p-2 flex items-start justify-center">
      <main className="main-glass w-full max-w-md h-[91vh] rounded-[48px] overflow-hidden relative flex flex-col pt-6 px-4">

        <div className="flex-1 w-full relative overflow-hidden">

          {/* ИЗОЛЯЦИЯ АДМИНА: Если зашел админ, жестко перекрываем контент заглушкой */}
          {currentRole === 'admin' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-xl font-bold mb-2">Панель администратора</h2>
              <p className="text-sm opacity-60">Интерфейс главного администратора находится в разработке.</p>
            </div>
          ) : (
            /* ОСНОВНОЙ КОНТЕНТ ДЛЯ ОСТАЛЬНЫХ РОЛЕЙ */
            <>
              {/* HOME (Доступно: Студент, Староста, Куратор) */}
              <div
                className={`absolute inset-0 w-full h-full flex flex-col overflow-y-auto ${
                  activeTab === 'home'
                    ? 'opacity-100 z-10'
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="flex-1 pb-4">
                  <HomeView user={user} isLoadingUser={false} />
                </div>
              </div>

              {/* EXCHANGE (Доступно только студенческому крылу) */}
              <div
                className={`absolute inset-0 w-full h-full flex flex-col overflow-y-auto ${
                  activeTab === 'exchange'
                    ? 'opacity-100 z-10'
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="flex-1 pb-4">
                  <AccessGuard allowedRoles={['student', 'leader']}>
                    <ExchangeView />
                  </AccessGuard>
                </div>
              </div>

              {/* REVIEWS (Доступно всем) */}
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

              {/* SETTINGS (Каждый видит внутри свои настройки) */}
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
            </>
          )}

        </div>

        {/* ДОКБАР: Отдаем ему текущую роль как умный проп */}
        <div className="flex-shrink-0 pb-6 pt-2">
          <Dockbar role={currentRole} />
        </div>

      </main>
    </div>
  );
};

export default AppLayout;