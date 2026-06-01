import React, { useEffect, useMemo } from 'react';
import { Home, StarIcon } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';

import TelegramSafeProvider from '../providers/TelegramSafeProvider.jsx';
import AppInitializer from "../components/status/AppInitializer.jsx";
import Dockbar from "../components/navigation/Dockbar.jsx";
import AccessGuard from '../components/guards/AccessGuard.jsx';

import { ExchangeIcon } from '../components/icons/ExchangeIcon.jsx';
import { SettingsIcon } from '../components/icons/SetingsIcon.jsx';

import HomeView from '../views/common/HomeViews.jsx';
import ExchangeView from '../views/ExchangeView';
import SettingsView from '../views/SettingsView';
import ReviewsView from '../views/common/ReviewsView.jsx';

/**
 * @file StudentLayout.jsx
 * @description Каркас интерфейса для ролей студента, старосты и куратора.
 * Управляет набором доступных вкладок и обеспечивает ролевую фильтрацию меню.
 */

/**
 * Слой интерфейса для обычных пользователей и кураторов.
 * @returns {React.JSX.Element}
 */
const StudentLayout = () => {
  const user = useAppStore((state) => state.user);
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  const currentRole = user?.role;

  // Полная конфигурация вкладок, включая компоненты контента и иконки навигации
  const tabsConfig = useMemo(() => [
    { id: 'home', content: <HomeView user={user} isLoadingUser={false} />, icon: Home },
    { id: 'exchange', content: <ExchangeView />, icon: ExchangeIcon, roles: ['student', 'leader'] },
    { id: 'reviews', content: <ReviewsView />, icon: StarIcon },
    { id: 'settings', content: <SettingsView />, icon: SettingsIcon },
  ], [user]);

  // Фильтруем элементы навигации на основе роли текущего пользователя
  const allowedTabs = useMemo(() => {
    return tabsConfig.filter(tab => !tab.roles || tab.roles.includes(currentRole));
  }, [tabsConfig, currentRole]);

  // Защита от нахождения на запрещенной вкладке при смене прав
  useEffect(() => {
    const isCurrentTabAllowed = allowedTabs.some(tab => tab.id === activeTab);
    if (!isCurrentTabAllowed && allowedTabs.length > 0) {
      setActiveTab(allowedTabs[0].id);
    }
  }, [activeTab, allowedTabs, setActiveTab]);

  return (
    <AppInitializer>
      <TelegramSafeProvider>

        <div className="flex-1 w-full relative overflow-hidden mt-4">
          {allowedTabs.map(({ id, content, roles }) => {
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
          })}
        </div>

        <div className="flex-shrink-0 pb-5 pt-2 z-20">
          <Dockbar
            items={allowedTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

      </TelegramSafeProvider>
    </AppInitializer>
  );
};

export default StudentLayout;