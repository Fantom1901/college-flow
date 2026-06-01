import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAppStore from '../../store/useAppStore.js';
import useGroupStore from '../../store/useGroupStore.js';
import { dutyApi } from '../../api/duty.js';
import { IS_DEV } from '../../config.js';

import GroupSettingsForm from '../../components/features/settings/GroupSettingsForm.jsx';
import PersonalSettings from '../../components/features/settings/PersonalSettings.jsx';

function CuratorSettingsView() {
  const user = useAppStore((state) => state.user);
  const { group, setGroup } = useGroupStore();
  const queryClient = useQueryClient();

  // Куратор ищет groupId в своем curator_profile
  const groupId = user?.curator_profile?.group_id || user?.group_id;
  const displaySettings = group?.settings || group;

  const mutation = useMutation({
    mutationFn: (data) => dutyApi.updateSettings(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duty-settings', groupId] });
    },
  });

  const handleSaveSettings = async (newSettings) => {
    if (IS_DEV) {
      console.log('[Dev Mode] Куратор изменил настройки группы:', newSettings);
      setGroup({
        ...group,
        settings: { ...group?.settings, ...newSettings }
      });
      return;
    }
    mutation.mutate(newSettings);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 px-2 gap-4">
      <GroupSettingsForm
        initialSettings={displaySettings}
        onSave={handleSaveSettings}
        isPending={IS_DEV ? false : mutation.isPending}
      />
      <PersonalSettings />
    </div>
  );
}

export default CuratorSettingsView;