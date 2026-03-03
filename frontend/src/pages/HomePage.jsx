import {useQuery} from '@tanstack/react-query';
import {usersApi} from '../api/users';
import useAppStore from '../store/useAppStore';

const HomePage = () => {
  const {setUser, activeTab} = useAppStore();

  const {data: user, isLoading, error} = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const data = await usersApi.getMe();
      setUser(data);
      return data;
    },
  });

  if (isLoading) return <div className="p-6 text-label-secondary">Загрузка...</div>;
  if (error) return <div className="p-6 text-accent-red">Ошибка: {error.message}</div>;

  return (
    <div className="p-6 pb-28 text-label-primary">
      {activeTab === 'home' && (
        <div className="animate-in fade-in duration-500">
          <h1 className="text-2xl font-bold mb-4">Привет, {user?.name || 'Никса'}!</h1>
          <p className="text-label-secondary">Тут будет список твоих дежурств.</p>
          <div
            className="w-full h-[1500px] border-2 border-dashed border-accent-purple/30 rounded-3xl flex items-end justify-center pb-10">
            <span className="text-accent-purple font-mono animate-bounce">
            Я в самом низу
          </span>
          </div>
        </div>
      )}

      {activeTab === 'exchange' && (
        <div className="animate-in fade-in duration-500">
          <h1 className="text-2xl font-bold mb-4">Обмен сменами</h1>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-in fade-in duration-500">
          <h1 className="text-2xl font-bold mb-4">Настройки</h1>
        </div>
      )}
    </div>
  );
};

export default HomePage;