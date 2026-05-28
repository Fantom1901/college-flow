import { create } from 'zustand';

const useGroupStore = create((set) => ({
  group: null, // Сюда прилетит объект группы (id, name, students)
  setGroup: (group) => set({ group }),
}));

export default useGroupStore;