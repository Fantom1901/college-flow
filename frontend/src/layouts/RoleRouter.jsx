import React from 'react';
import useAppStore from '../store/useAppStore.js';
import AccessGuard from '../components/guards/AccessGuard.jsx';
import AppLoader from '../components/status/AppLoader.jsx';

// Импортируем ролевые лейауты
import AdminLayout from './AdminLayout.jsx';
import CuratorLayout from './CuratorLayout.jsx';
import StudentLayout from './StudentLayout.jsx';

const RoleRouter = () => {
  const user = useAppStore((state) => state.user);

  // Если юзер ещё загружается или данных нет — показываем глобальный лоадер
  if (!user || !user.role) {
    return <AppLoader />;
  }

  // Распределяем интерфейсы по ролям
  switch (user.role) {
    case 'admin':
      return (
        <AccessGuard allowedRoles={['admin']}>
          <AdminLayout />
        </AccessGuard>
      );

    case 'curator':
      return (
        <AccessGuard allowedRoles={['curator']}>
          <CuratorLayout />
        </AccessGuard>
      );

    case 'leader':
    case 'student':
      return (
        <AccessGuard allowedRoles={['student', 'leader']}>
          <StudentLayout />
        </AccessGuard>
      );

    default:
      return (
        <div className="flex items-center justify-center h-screen text-white">
          У вас нет прав доступа к системе. Обратитесь к администратору.
        </div>
      );
  }
};

export default RoleRouter;