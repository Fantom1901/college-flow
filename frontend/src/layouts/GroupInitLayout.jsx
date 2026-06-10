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
 * Синхронизирована со строгими типами Pydantic-модели GroupInitRequest на FastAPI.
 */
const GroupInitLayout = () => {
  const queryClient = useQueryClient();
  const user = useAppStore((state) => state.user);
  const setNeedsGroupInit = useAppStore((state) => state.setNeedsGroupInit);
  const [errorText, setErrorText] = useState('');

  // Предохранитель от двойных кликов/отправок при перерендере
  const isSuccessfullyDispatched = useRef(false);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      // Если запущен локальный сервер Vite (DEV), уходим в симулятор
      if (import.meta.env.DEV) {
        return simulateGroupInitialization(payload, queryClient);
      }

      // ИСПРАВЛЕНО: Сначала жестко берём инвайт-код из официального Telegram SDK (start_param),
      // так как на мобилках в URL параметров tgWebAppStartParam или startapp просто НЕТ.
      const inviteCode =
        window.Telegram?.WebApp?.initDataUnsafe?.start_param ||
        new URLSearchParams(window.location.search).get('tgWebAppStartParam') ||
        new URLSearchParams(window.location.search).get('startapp') ||
        'default_curator_code';

      // Гарантируем получение числового Telegram ID
      const rawTgId = user?.tg_id || window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      const cleanTgId = rawTgId ? parseInt(rawTgId, 10) : null;

      // Валидация перед отправкой, чтобы фронт не слал заведомый мусор
      if (!cleanTgId || isNaN(cleanTgId)) {
        throw new Error('Критическая ошибка: Не удалось определить твой Telegram ID для регистрации профиля.');
      }

      // ПРОД: Отправляем строго по спецификации OpenAPI схемы GroupInitRequest
      return groupsApi.initGroup({
        invite_code: String(inviteCode).trim(),
        full_name: String(payload.fullName).trim(),
        group_name: String(payload.groupName).trim(),
        tg_id: cleanTgId, // Обязательный integer
        username: user?.username || window.Telegram?.WebApp?.initDataUnsafe?.user?.username || null // Опциональный string/null
      });
    },
    onSuccess: (data, variables) => {
      isSuccessfullyDispatched.current = true;

      if (tgHaptics?.notification) tgHaptics.notification('success');

      if (!import.meta.env.DEV) {
        const { setGroup } = useGroupStore.getState();
        const { setUser } = useAppStore.getState();

        // Схема GroupInitResponse возвращает group_id и group_name
        setGroup({
          id: data.group_id,
          name: data.group_name,
          students: [] // Изначально группа пустая, студенты зайдут сами по инвайтам
        });

        // Синхронизируем сессию куратора в стейте
        setUser({
          ...user,
          curator_profile: {
            id: data.group_id, // Привязываем временный ID профиля
            full_name: variables.fullName,
            group_id: data.group_id
          }
        });

        // Сбрасываем кэши React Query для обновления данных во всем приложении
        queryClient.invalidateQueries({ queryKey: ['userMe'] });
        queryClient.invalidateQueries({ queryKey: ['myGroup'] });
      }

      // Закрываем экран инициализации, пускаем куратора в панель управления
      setNeedsGroupInit(false);
    },
    onError: (err) => {
      if (tgHaptics?.notification) tgHaptics.notification('error');

      // Логируем полную ошибку в консоль TMA, чтобы было легче дебажить через Eruda/VConsole
      console.error('[GroupInit] Ошибка при отправке запроса:', err?.response?.data || err);

      // Парсим ошибки валидации FastAPI (они лежат в массиве detail)
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
   * Передача данных заполненной формы в триггер мутации React Query.
   * @param {Object} formData - Объект с полями fullName и groupName
   */
  const handleFormSubmit = (formData) => {
    if (isSuccessfullyDispatched.current || mutation.isPending) return;
    setErrorText('');
    mutation.mutate(formData);
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