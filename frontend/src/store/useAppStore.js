import { create } from 'zustand';

/**
 * useAppStore - Глобальный стор авторизации и сессии ядра College-Flow.
 * Отвечает за состояние текущего аккаунта, роли и статус инициализации приложения.
 */
const useAppStore = create((set, get) => ({
  user: null, // Объект авторизованного юзера (UserRead по OpenAPI)
  serverStatus: 'offline', // 'offline' | 'loading' | 'online' | 'error'
  activeTab: 'home', // Текущий экран UI
  needsGroupInit: false, // Флаг форсирования экрана создания группы для кураторов без группы

  // Экшены управления сессией
  setUser: (userData) => set({ user: userData }),
  setServerStatus: (status) => set({ serverStatus: status }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setNeedsGroupInit: (needed) => set({ needsGroupInit: needed }),

  /**
   * Сброс авторизации (logout)
   */
  clearAuth: () => set({
    user: null,
    needsGroupInit: false,
    serverStatus: 'offline'
  }),

  // Вычисляемые свойства (Хелперы ролей через get())
  isStudent: () => get().user?.role === 'student',
  isLeader: () => get().user?.role === 'leader',
  isCurator: () => get().user?.role === 'curator',
  isAdmin: () => get().user?.role === 'admin',

  /**
   * Проверка прав доступа для роутера
   * @param {string[]} allowedRoles - Разрешенные роли
   * @returns {boolean}
   */
  hasRole: (allowedRoles) => {
    const role = get().user?.role;
    if (!role) return false;
    return allowedRoles.includes(role);
  }
}));

export default useAppStore;