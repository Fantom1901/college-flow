import React from 'react';
import useAppStore from '../store/useAppStore.js';

// Импортируем ролевые вьюхи
import StudentSettingsView from './student/StudentSettingsView.jsx';
import LeaderSettingsView from './leader/LeaderSettingsView.jsx';
import CuratorSettingsView from './curator/CuratorSettingsView.jsx';

function SettingsView() {
  const user = useAppStore((state) => state.user);
  const role = user?.role;

  // Роутим интерфейс в зависимости от роли
  switch (role) {
    case 'leader':
    case 'admin':
      return <LeaderSettingsView />;
    case 'curator':
      return <CuratorSettingsView />;
    case 'student':
    default:
      return <StudentSettingsView />;
  }
}

export default SettingsView;