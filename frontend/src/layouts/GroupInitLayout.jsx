import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TelegramSafeProvider from '../providers/TelegramSafeProvider.jsx';
import AppInitializer from "../components/status/AppInitializer.jsx";
import { GroupInitForm } from "../components/features/settings/GroupInitForm.jsx";

import useAppStore from '../store/useAppStore.js';
import useGroupStore from '../store/useGroupStore.js';
import { groupsApi } from '../api/groups.js';
import { tgHaptics } from "../../services/telegram/index.js";
import { simulateGroupInitialization } from '../../services/initApp.js';

/**
 * GroupInitLayout - Страница первоначальной настройки группы куратором.
 */
const GroupInitLayout = () => {
  const queryClient = useQueryClient();
  const user = useAppStore((state) => state.user);
  const setNeedsGroupInit = useAppStore((state) => state.setNeedsGroupInit);
  const [errorText, setErrorText] = useState('');

  const isSuccessfullyDispatched = useRef(false);

  const mutation = useMutation({
    mutationFn: async (fullPayload) => {
      if (import.meta.env.DEV) {
        return simulateGroupInitialization(fullPayload, queryClient);
      }

      // Отправляем на бэк полностью готовый и валидный объект
      return groupsApi.initGroup(fullPayload);
    },
    onSuccess: (data, variables) => {
      isSuccessfullyDispatched.current = true;

      if (tgHaptics?.notification) tgHaptics.notification('success');

      if (!import.meta.env.DEV) {
        const { setGroup } = useGroupStore.getState();
        const { setUser } = useAppStore.getState();

        setGroup({
          id: data.group_id,
          name: data.group_name,
          students: []
        });

        setUser({
          ...user,
          curator_profile: {
            id: data.group_id,
            full_name: variables.full_name,
            group_id: data.group_id
          }
        });

        queryClient.invalidateQueries({ queryKey: ['userMe'] });
        queryClient.invalidateQueries({ queryKey: ['myGroup'] });
      }

      setNeedsGroupInit(false);
    },
    onError: (err) => {
      if (tgHaptics?.notification) tgHaptics.notification('error');
      console.error('[GroupInit] Ошибка при отправке запроса:', err?.response?.data || err);

      let backendMessage = '';
      if (err?.response?.data?.detail && Array.isArray(err.response.data.detail)) {
        backendMessage = err.response.data.detail
          .map(error => `${error.loc.join('.')}: ${error.msg}`)
          .join(' | ');
      } else {
        backendMessage = err?.response?.data?.detail || err?.message;
      }

      setErrorText(backendMessage || 'Ошибка создания группы. Проверь корректность данных.');
    }
  });

  /**
   * Обработка отправки формы
   * @param {Object} formData - Данные из инпута (fullName, groupName)
   */
  const handleFormSubmit = (formData) => {
    if (isSuccessfullyDispatched.current || mutation.isPending) return;
    setErrorText('');

    // 1. Извлекаем инвайт-код из Telegram SDK (на мобилках) или параметров строки
    const inviteCode =
      window.Telegram?.WebApp?.initDataUnsafe?.start_param ||
      new URLSearchParams(window.location.search).get('tgWebAppStartParam') ||
      new URLSearchParams(window.location.search).get('startapp') ||
      'default_curator_code';

    // 2. Получаем ID пользователя
    const rawTgId = user?.tg_id || window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const cleanTgId = rawTgId ? parseInt(rawTgId, 10) : null;

    if (!cleanTgId || isNaN(cleanTgId)) {
      setErrorText('Критическая ошибка: Не удалось определить ваш Telegram ID.');
      return;
    }

    // 3. Формируем чистый payload строго под Pydantic-модель бэкенда
    const fullPayload = {
      invite_code: String(inviteCode).trim(),
      full_name: String(formData.fullName).trim(),
      group_name: String(formData.groupName).trim(),
      tg_id: cleanTgId,
      username: user?.username || window.Telegram?.WebApp?.initDataUnsafe?.user?.username || null
    };

    // Запускаем отправку
    mutation.mutate(fullPayload);
  };

  return (
    <AppInitializer>
      <TelegramSafeProvider>
        <div className="flex-1 w-full flex flex-col items-center justify-center py-6 overflow-y-auto scrollbar-none">
          <GroupInitForm
            onSubmit={handleFormSubmit}
            isLoading={mutation.isPending || isSuccessfullyDispatched.current}
            error={errorText}
          />
        </div>
      </TelegramSafeProvider>
    </AppInitializer>
  );
};

export default GroupInitLayout;