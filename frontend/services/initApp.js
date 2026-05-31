import useAppStore from '../src/store/useAppStore.js';
import useGroupStore from '../src/store/useGroupStore.js';
import { usersApi } from '../src/api/users.js';
import { groupsApi } from '../src/api/groups.js';

import {
  IS_DEV,
  MOCK_USER,
  MOCK_GROUP,
  MOCK_FORCE_INIT,
  MOCK_WEEKLY_DUTY,
  MOCK_DUTY_SETTINGS,
  MOCK_LEADERBOARD,
  MOCK_EXCHANGE
} from '../src/config';

/**
 * Симуляция создания группы для DEV MODE.
 * Засовывает моки в Zustand и кэш React Query, имитируя идеальный ответ сервера.
 * * @param {Object} payload - Данные формы { fullName, groupName }
 * @param {Object} queryClient - Экземпляр QueryClient из React Query
 */
export const simulateGroupInitialization = async (payload, queryClient) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const { setGroup, setWeeklyDuty, setDutySettings, setLeaderboard } = useGroupStore.getState();
  const { setUser, setNeedsGroupInit } = useAppStore.getState();
  const currentUser = useAppStore.getState().user;

  // 1. Заливаем обновленную группу и дефолтные массивы дежурств в Zustand
  setGroup({
    ...MOCK_GROUP,
    name: payload.groupName
  });
  setWeeklyDuty(MOCK_WEEKLY_DUTY || []);
  setDutySettings(MOCK_DUTY_SETTINGS || null);
  setLeaderboard(MOCK_LEADERBOARD || []);

  // 2. Записываем моки обменов напрямую в кэш React Query, чтобы хук useExchangeData их сразу подхватил
  if (queryClient) {
    queryClient.setQueryData(['exchangeRequests'], MOCK_EXCHANGE);
  }

  // 3. Апдейтим профиль куратора
  setUser({
    ...currentUser,
    curator_profile: {
      id: MOCK_USER?.curator_profile?.id || 5,
      full_name: payload.fullName,
      group_id: MOCK_GROUP?.id || 1
    }
  });

  setNeedsGroupInit(false);

  return {
    status: "success",
    group_id: MOCK_GROUP?.id || 1,
    group_name: payload.groupName
  };
};

/**
 * initApp - Глобальный хук инициализации.
 * @param {Object} queryClient - Передаем сюда экземпляр queryClient, чтобы управлять кэшем обменов в дев-режиме
 */
export const initApp = async (queryClient) => {
  const { setUser, setServerStatus, setNeedsGroupInit } = useAppStore.getState();
  const { setGroup, setWeeklyDuty, setDutySettings, setLeaderboard } = useGroupStore.getState();

  // ==========================================
  // 1. ЛОГИКА ДЛЯ РЕЖИМА РАЗРАБОТКИ (DEV MODE)
  // ==========================================
  if (IS_DEV) {
    console.log('[InitApp] DEV MODE активен. Прогрев кэша и сторов моками.');

    setUser(MOCK_USER);

    if (MOCK_FORCE_INIT && MOCK_USER?.role === 'curator') {
      console.log('[InitApp] Симуляция первого запуска куратора. Сторы очищены.');

      setGroup(null);
      setWeeklyDuty([]);
      setDutySettings(null);
      setLeaderboard([]);

      // Сбрасываем кэш обменов в пустые массивы по схемам OpenAPI
      if (queryClient) {
        queryClient.setQueryData(['exchangeRequests'], { incoming: [], outgoing: [], history: [] });
      }

      setNeedsGroupInit(true);
    } else {
      console.log('[InitApp] Форсированный накат всех моков.');

      setGroup(MOCK_GROUP || null);
      setWeeklyDuty(MOCK_WEEKLY_DUTY || []);
      setDutySettings(MOCK_DUTY_SETTINGS || null);
      setLeaderboard(MOCK_LEADERBOARD || []);

      // Инициализируем данные обменов в кэше React Query
      if (queryClient) {
        queryClient.setQueryData(['exchangeRequests'], MOCK_EXCHANGE);
      }

      setNeedsGroupInit(false);
    }

    setServerStatus('online');
    return;
  }

  // ==========================================
  // 2. ЛОГИКА ДЛЯ ПРОДАКШЕНА
  // ==========================================
  try {
    setServerStatus('loading');
    const userData = await usersApi.getMe();
    setUser(userData);

    const isCurator = userData?.role === 'curator';
    const groupId = userData.student_profile?.group_id || userData.curator_profile?.group_id;

    if (isCurator) {
      if (!groupId) {
        setNeedsGroupInit(true);
      } else {
        try {
          const groupData = await groupsApi.getMy();
          setGroup(groupData);
          setNeedsGroupInit(false);
        } catch (groupError) {
          if (groupError?.response?.status === 404) {
            setNeedsGroupInit(true);
          } else {
            throw groupError;
          }
        }
      }
    } else {
      setNeedsGroupInit(false);
      if (groupId) {
        try {
          const groupData = await groupsApi.getMy();
          setGroup(groupData);
        } catch (groupError) {
          console.error('[InitApp] Не удалось загрузить группу:', groupError);
        }
      }
    }
    setServerStatus('online');
  } catch (error) {
    console.error('[InitApp] Критическая ошибка:', error);
    setServerStatus('error');
  }
};