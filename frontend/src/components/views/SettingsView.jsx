import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dutyApi } from '../../api/duty';
import { IS_DEV } from '../../config';
import useAppStore from "../../store/useAppStore.js";

import GroupSettingsForm from '../settings/GroupSettingsForm';
import GroupSettingsInfo from '../settings/GroupSettingsInfo';
import PersonalSettings from '../settings/PersonalSettings';

// Моковые дефолтные настройки для Dev Mode
const MOCK_SETTINGS = {
  mechanism: 'alphabetical',
  work_days: [1, 3, 5],
  person_per_day: 2,
  group_id: 1
};

function SettingsView() {
  const { user } = useAppStore();
  const groupId = user?.student_profile?.group_id || user?.curator_profile?.group_id || user?.group_id;

  // Тянем настройки группы с бэка
  const { data: settings, isLoading } = useQuery({
    queryKey: ['duty-settings', groupId],
    queryFn: () => dutyApi.getSettings(groupId),
    enabled: !!groupId && !IS_DEV,
  });

  const displaySettings = IS_DEV ? MOCK_SETTINGS : settings;

  // Определяем права: староста (leader), куратор (curator) или админ системы имеют доступ к форме
  const isGroupAdmin = user?.role === 'leader' || user?.role === 'curator' || user?.role === 'admin';

  if (isLoading && !IS_DEV) {
    return (
      <div className="w-full flex-1 flex flex-col gap-3 px-2 animate-pulse mt-4">
        <div className="h-48 w-full bg-white/10 rounded-[32px]" />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 px-2 gap-4">

      {/* 1. Блок настроек группы: Либо форма для лидера, либо инфо-карточка для студента */}
      {isGroupAdmin ? (
        <GroupSettingsForm groupId={groupId} initialSettings={displaySettings} />
      ) : (
        <GroupSettingsInfo settings={displaySettings} />
      )}

      {/* 2. Блок общих личных настроек, доступный всем ролям */}
      <PersonalSettings />

    </div>
  );
}

export default SettingsView;