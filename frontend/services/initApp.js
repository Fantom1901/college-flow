import useAppStore from '../src/store/useAppStore.js';
import useGroupStore from '../src/store/useGroupStore.js';
import { usersApi } from '../src/api/users.js';
import { groupsApi } from '../src/api/groups.js';
import { IS_DEV, MOCK_USER, MOCK_GROUP, MOCK_FORCE_INIT } from '../src/config';

export const initApp = async () => {
  const { setUser, setServerStatus, setNeedsGroupInit } = useAppStore.getState();
  const { setGroup } = useGroupStore.getState();

  // 1. В DEV MODE логика настраивается одной переменной
  if (IS_DEV) {
    console.log('[InitApp] DEV MODE активен.');
    setUser(MOCK_USER);

    if (MOCK_FORCE_INIT && MOCK_USER?.role === 'curator') {
      console.log('[InitApp] Симуляция первого запуска куратора (группы нет).');
      setGroup(null); // Инициализация начнется с пустого стора
      setNeedsGroupInit(true);
    } else {
      console.log('[InitApp] Загрузка стандартного монолита группы.');
      setGroup(MOCK_GROUP || null);
      setNeedsGroupInit(false);
    }

    setServerStatus('online');
    return;
  }

  // 2. Логика для продакшена (остается нетронутой и надежной)
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