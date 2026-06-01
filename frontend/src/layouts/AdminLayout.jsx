import React, { useState, useMemo } from 'react';
import { LayoutDashboard, FlaskConical } from 'lucide-react';

import TelegramSafeProvider from '../providers/TelegramSafeProvider.jsx';
import AppInitializer from "../components/status/AppInitializer.jsx";
import Dockbar from "../components/navigation/Dockbar.jsx";

import AdminDashboardView from '../views/admin/AdminDashboardView.jsx';
import ComponentSandboxView from '../views/admin/ComponentSandboxView.jsx';

/**
 * @file AdminLayout.jsx
 * @description Изолированный каркас интерфейса для роли администратора.
 * Предоставляет собственную систему вкладок (Панель управления / Песочница) через переиспользуемый Dockbar.
 */

/**
 * Слой интерфейса администратора.
 * @returns {React.JSX.Element}
 */
const AdminLayout = () => {
  // Локальный стейт табов для админа, изолированный от глобального стора студентов
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');

  // Конфигурация вкладок панели администратора
  const adminTabs = useMemo(() => [
    { id: 'dashboard', content: <AdminDashboardView />, icon: LayoutDashboard },
    { id: 'sandbox', content: <ComponentSandboxView />, icon: FlaskConical }
  ], []);

  return (
    <AppInitializer>
      <TelegramSafeProvider>

        {/* Контентная зона админа */}
        <div className="flex-1 w-full relative overflow-hidden mt-4">
          {adminTabs.map(({ id, content }) => {
            const isActive = activeAdminTab === id;

            return (
              <div
                key={id}
                className={`absolute inset-0 w-full h-full flex flex-col overflow-y-auto transition-opacity duration-300 ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="flex-1 pb-24">
                  {content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Админский докбар, использующий чистый презентационный компонент */}
        <div className="flex-shrink-0 pb-5 pt-2 z-20">
          <Dockbar
            items={adminTabs}
            activeTab={activeAdminTab}
            onTabChange={setActiveAdminTab}
          />
        </div>

      </TelegramSafeProvider>
    </AppInitializer>
  );
};

export default AdminLayout;