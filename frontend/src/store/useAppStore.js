import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  user: null,
  serverStatus: 'offline', // 'offline' | 'loading' | 'online' | 'error'
  activeTab: 'home',

  // Экшены для изменения состояния
  setUser: (userData) => set({ user: userData }),
  setServerStatus: (status) => set({ serverStatus: status }),
  setActiveTab: (tab) => set({ activeTab: tab }),

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