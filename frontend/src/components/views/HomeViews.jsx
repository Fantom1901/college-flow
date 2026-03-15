import { useQuery } from '@tanstack/react-query';
import { dutyApi } from '../../api/duty';
import DutyStack from "../DutyStack.jsx";

const HomeView = ({ user }) => {
  const groupId = user?.student_profile?.group_id;

  // Твои реальные данные из API (пока закомментим или используем моки)
  const mockData = [
    { id: 1, date: 'Сегодня 15 мая', users: ['Ветров Тимофей', 'Тюменцева Диана'] },
    { id: 2, date: 'Завтра 16 мая', users: ['Иванов Иван', 'Петров Петр'] },
    { id: 3, date: 'Послезавтра 17 мая', users: ['Сидоров Сидор', 'Алексеев Алексей'] },
  ];

  return (
    <div className="flex flex-col items-center p-10 select-none">
      <header className="w-full">
        {/* Вызываем нашу анимированную колоду */}
        <DutyStack initialItems={mockData} />
      </header>

      <section className="mt-12 text-center">
        <div className="text-label-tertiary text-[11px] uppercase tracking-widest">
          Свайпни вверх или вниз
        </div>
      </section>
    </div>
  );
};

export default HomeView;