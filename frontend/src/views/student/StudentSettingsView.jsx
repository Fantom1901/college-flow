import React from 'react';
import useGroupStore from '../../store/useGroupStore.js';
import GroupSettingsInfo from '../../components/features/settings/GroupSettingsInfo.jsx';
import PersonalSettings from '../../components/features/settings/PersonalSettings.jsx';

function StudentSettingsView() {
  const group = useGroupStore((state) => state.group);
  const displaySettings = group?.settings || group; // Фолбек на случай разной структуры объекта группы

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 px-2 gap-4">
      {/* Студент видит только инфо-карточку текущих правил группы */}
      <GroupSettingsInfo settings={displaySettings} />

      {/* Личные настройки */}
      <PersonalSettings />
    </div>
  );
}

export default StudentSettingsView;