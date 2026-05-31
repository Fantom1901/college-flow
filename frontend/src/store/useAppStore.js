import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  user: null,
  group: null, // Данные текущей группы (id, name, students)
  serverStatus: 'offline', // 'offline' | 'loading' | 'online' | 'error'
  activeTab: 'home',
  needsGroupInit: false, // Флаг принудительного открытия экрана создания группы для куратора

  // Экшены для изменения базового состояния
  setUser: (userData) => set({ user: userData }),
  setServerStatus: (status) => set({ serverStatus: status }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Новые экшены для работы с группами и инициализацией
  setGroup: (groupData) => set({ group: groupData }),
  setNeedsGroupInit: (needed) => set({ needsGroupInit: needed }),

  /**
   * Сброс данных авторизации и состояния приложения
   */
  clearAuth: () => set({
    user: null,
    group: null,
    needsGroupInit: false,
    serverStatus: 'offline'
  }),

  // Хелперы ролей (Вычисляемые свойства через get())
  isStudent: () => get().user?.role === 'student',
  isLeader: () => get().user?.role === 'leader',
  isCurator: () => get().user?.role === 'curator',
  isAdmin: () => get().user?.role === 'admin',

  /**
   * Универсальный хелпер проверки доступа
   * @param {string[]} allowedRoles - Массив разрешенных ролей, например ['leader', 'curator']
   * @returns {boolean}
   */
  hasRole: (allowedRoles) => {
    const role = get().user?.role;
    if (!role) return false;
    return allowedRoles.includes(role);
  }
}));

export default useAppStore;