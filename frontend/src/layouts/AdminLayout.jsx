import  React from 'react';
import TelegramSafeProvider from '../providers/TelegramSafeProvider.jsx';
import AppInitializer from "../components/status/AppInitializer.jsx";
import AdminDashboardView from '../views/admin/AdminDashboardView.jsx';

const AdminLayout = () => {
  return (
    <AppInitializer>
      <TelegramSafeProvider>
        <div className="flex-1 w-full relative overflow-hidden mt-4">
          <div className="absolute inset-0 w-full h-full flex flex-col overflow-y-auto pb-4">
            <AdminDashboardView />
          </div>
        </div>
        {/* Если админу нужен будет свой Dockbar или меню, добавим его сюда */}
      </TelegramSafeProvider>
    </AppInitializer>
  );
};

export default AdminLayout;