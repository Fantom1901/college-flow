import { create } from 'zustand';

/**
 * useGroupStore - Единое хранилище данных текущей группы.
 * Изолирует расписание дежурств, настройки автоматизации куратора и лидерборд.
 */
const useGroupStore = create((set) => ({
  group: null,        // Базовые данные (id, name, students) -> Схема GroupRead
  weeklyDuty: [],     // Недельное расписание дежурств -> DutyScheduleWithStudent[]
  dutySettings: null, // Настройки распределения -> DutySettingsRead
  leaderboard: [],    // Таблица рейтинга студентов

  // Экшены для наполнения стора (вызываются в initApp или мутациях настроек)
  setGroup: (group) => set({ group }),
  setWeeklyDuty: (weeklyDuty) => set({ weeklyDuty }),
  setDutySettings: (dutySettings) => set({ dutySettings }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),

  /**
   * Полный сброс состояния группы при выходе из аккаунта
   */
  clearGroupData: () => set({
    group: null,
    weeklyDuty: [],
    dutySettings: null,
    leaderboard: []
  })
}));

export default useGroupStore;