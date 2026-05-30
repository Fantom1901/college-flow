import useAppStore from '../src/store/useAppStore.js';
import useGroupStore from '../src/store/useGroupStore.js';
import { usersApi } from '../src/api/users.js';
import { groupsApi } from '../src/api/groups.js';
import { IS_DEV, MOCK_USER, MOCK_GROUP } from '../src/config';

export const initApp = async () => {
  const { setUser, setServerStatus } = useAppStore.getState();
  const { setGroup } = useGroupStore.getState();

  // 1. В DEV MODE намертво изолируем фронт от сети и выставляем стейты из конфига
  if (IS_DEV) {
    console.log('[InitApp] Запущено в режиме разработки (DEV MODE). Загрузка моков...');
    setUser(MOCK_USER);
    setGroup(MOCK_GROUP || null); // Сюда теперь падает объект со студентами, дежурствами и настройками!
    setServerStatus('online');
    return;
  }

  // 2. Логика для продакшена
  try {
    setServerStatus('loading');

    const userData = await usersApi.getMe();
    setUser(userData);

    const groupId = userData.student_profile?.group_id || userData.curator_profile?.group_id;

    if (groupId) {
      try {
        const groupData = await groupsApi.getMy();
        setGroup(groupData);
      } catch (groupError) {
        console.error('[InitApp] Не удалось загрузить данные группы:', groupError);
      }
    }

    setServerStatus('online');
  } catch (error) {
    console.error('[InitApp] Критическая ошибка инициализации приложения:', error);
    setServerStatus('error');
  }
};