import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAppStore from '../../store/useAppStore.js';
import useGroupStore from '../../store/useGroupStore.js';
import { dutyApi } from '../../api/duty.js';
import { IS_DEV } from '../../config.js';

import GroupSettingsForm from '../../components/features/settings/GroupSettingsForm.jsx';
import PersonalSettings from '../../components/features/settings/PersonalSettings.jsx';

function LeaderSettingsView() {
  const user = useAppStore((state) => state.user);
  const { group, setGroup } = useGroupStore();
  const queryClient = useQueryClient();

  const groupId = user?.student_profile?.group_id || user?.group_id;
  const displaySettings = group?.settings || group;

  // React Query мутация для продакшена
  const mutation = useMutation({
    mutationFn: (data) => dutyApi.updateSettings(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duty-settings', groupId] });
      // Также можно обновить синк со стором при необходимости
    },
  });

  // Единый безопасный метод сохранения для формы
  const handleSaveSettings = async (newSettings) => {
    if (IS_DEV) {
      console.log('[Dev Mode] Сохранение настроек группы без сети:', newSettings);
      // Изолированно обновляем стейт в Zustand, сохраняя структуру монолита
      setGroup({
        ...group,
        settings: {
          ...group?.settings,
          ...newSettings
        }
      });
      return;
    }

    // В прод-режиме отправляем запрос на бэк
    mutation.mutate(newSettings);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 px-2 gap-4">
      {/* Форма редактирования настроек группы */}
      <GroupSettingsForm
        initialSettings={displaySettings}
        onSave={handleSaveSettings}
        isPending={IS_DEV ? false : mutation.isPending}
      />

      {/* Личные настройки */}
      <PersonalSettings />
    </div>
  );
}

export default LeaderSettingsView;