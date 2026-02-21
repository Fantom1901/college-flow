import { useEffect } from 'react';
import { usersApi } from '../api/users';
import useAppStore from '../store/useAppStore';
import Dockbar from '../components/Dockbar';

const HomePage = () => {
  const { setUser, user } = useAppStore();

  useEffect(() => {
    // Получаем данные юзера (теперь CORS нам не мешает!)
    usersApi.getMe()
      .then(data => {
        setUser(data);
      })
      .catch(err => console.error("Ошибка загрузки профиля:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white p-6 pb-24">
      {/* Контент страницы (Рейтинг и т.д.) */}
      <div className="mt-10">
        <h1 className="text-2xl font-bold opacity-50 mb-4">РЕЙТИНГ</h1>
        {/* Тут позже отрендерим список из макета */}
        <p>Привет, {user?.curator_profile?.full_name || 'Загрузка...'}</p>
      </div>

      {/* Наш Докбар */}
      <Dockbar />
    </div>
  );
};

export default HomePage;