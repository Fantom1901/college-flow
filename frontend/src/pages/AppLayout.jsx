import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import useAppStore from '../store/useAppStore.js';

// Импортируй новые "виды" (Views)
import HomeView from '../components/views/HomeViews.jsx';
import ExchangeView from '../components/views/ExchangeView';
import SettingsView from '../components/views/SettingsView';

const AppLayout = () => {
  const { setUser, activeTab } = useAppStore();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const data = await usersApi.getMe();
      setUser(data);
      return data;
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen text-label-secondary animate-pulse">
      Загрузка профиля...
    </div>
  );

  if (error) return (
    <div className="p-6 text-accent-red bg-accent-red/10 rounded-2xl m-4">
      Ошибка: {error.message}
    </div>
  );

  return (
    <div>
      <main className="px-9 py-33 pt-24">
        {activeTab === 'home' && <HomeView user={user} />}
        {activeTab === 'exchange' && <ExchangeView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

export default AppLayout;