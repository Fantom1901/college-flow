import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TelegramSafeProvider from '../components/common/TelegramSafeProvider.jsx';
import AppInitializer from "../components/status/AppInitializer.jsx";
import { GroupInitForm } from "../components/settings/GroupInitForm.jsx";

import useAppStore from '../store/useAppStore.js';
import useGroupStore from '../store/useGroupStore.js';
import { groupsApi } from '../api/groups.js';
import { tgHaptics } from "../../services/telegram/index.js"; // Корректируй точки, если надо

/**
 * Равноправная страница для первоначальной настройки группы куратором.
 */
const GroupInitLayout = () => {
  const queryClient = useQueryClient();
  const user = useAppStore((state) => state.user);
  const setNeedsGroupInit = useAppStore((state) => state.setNeedsGroupInit);
  const [errorText, setErrorText] = useState('');

  const mutation = useMutation({
    mutationFn: async (payload) => {
      // payload прилетает из формы: { fullName: "...", groupName: "..." }

      // ДЕВ-МОД: Чистая симуляция Zustand
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Имитируем пинг бэка

        // Возвращаем фейковый ответ группы
        return {
          id: 777,
          name: payload.groupName,
          students: [], // Изначально пустая группа
          weekly_duty: [],
          leaderboard: [],
          settings: {
            mechanism: 'alphabetical',
            work_days: [1, 3, 5],
            person_per_day: 2,
            group_id: 777
          }
        };
      }

      // ПРОД: Скорректированный запрос на FastAPI под твои два поля
      // Если бэк ждет snake_case, мапим: { full_name: payload.fullName, group_name: payload.groupName }
      return groupsApi.initGroup({
        full_name: payload.fullName,
        group_name: payload.groupName
      });
    },
    onSuccess: (data, variables) => {
      if (tgHaptics?.notification) tgHaptics.notification('success');

      // Обновляем Zustand сторы на лету
      const { setGroup } = useGroupStore.getState();
      const { setUser } = useAppStore.getState();

      setGroup(data); // Закидываем созданную группу в стейт

      // Обновляем текущего юзера, прописав ему ФИО и ID созданной группы
      setUser({
        ...user,
        curator_profile: {
          id: data.id,
          full_name: variables.fullName,
          group_id: data.id
        }
      });

      // Инвалидируем кэш для прома на всякий случай
      if (!import.meta.env.DEV) {
        queryClient.invalidateQueries({ queryKey: ['userMe'] });
        queryClient.invalidateQueries({ queryKey: ['myGroup'] });
      }

      // ТУШИМ ЭКРАН ИНИЦИАЛИЗАЦИИ -> main.jsx мгновенно переключит на AppLayout
      setNeedsGroupInit(false);
    },
    onError: (err) => {
      if (tgHaptics?.notification) tgHaptics.notification('error');
      const backendMessage = err?.response?.data?.detail?.[0]?.msg || err?.response?.data?.detail || err?.message;
      setErrorText(backendMessage || 'Ошибка создания группы.');
    }
  });

  const handleFormSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <AppInitializer>
      <TelegramSafeProvider>

        <div className="flex-1 w-full relative overflow-y-auto mt-4 px-4 pb-6 flex flex-col items-center justify-center min-h-[80vh]">
          <GroupInitForm
            onSubmit={handleFormSubmit}
            isLoading={mutation.isPending}
          />

          {/* Вывод ошибки мутации, если бэк или симуляция упали */}
          {errorText && (
            <div className="mt-4 max-w-md w-full px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-center">
              {errorText}
            </div>
          )}
        </div>

      </TelegramSafeProvider>
    </AppInitializer>
  );
};

export default GroupInitLayout;