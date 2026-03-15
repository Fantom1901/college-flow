import {create} from 'zustand';

const useAppStore = create((set) => ({
  user: null, // Здесь будет лежать наш "cool_curator"
  serverStatus: 'offline',
  activeTab: 'home', // Для переключения в Dockbar

  setUser: (userData) => set({user: userData}),
  setServerStatus: (status) => set({serverStatus: status}),
  setActiveTab: (tab) => set({activeTab: tab}),
}));

export default useAppStore;