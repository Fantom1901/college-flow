import React from 'react';
import useAppStore from '../../store/useAppStore.js';
import useGroupStore from '../../store/useGroupStore.js';
import DutyStack from "../../components/common/DutyStack.jsx";
import GroupHeader from "../../components/common/GroupHeader.jsx";
import Leaderboard from "../../components/common/Leaderboard.jsx";
import { formatDutyDate } from '../../utils/dateFormatter.js';

const HomeView = () => {
  // Достаем юзера и статус загрузки приложения из AppStore
  const user = useAppStore((state) => state.user);
  const serverStatus = useAppStore((state) => state.serverStatus);
  const isLoadingUser = serverStatus === 'loading';

  // Достаем монолит группы из GroupStore
  const group = useGroupStore((state) => state.group);
  const groupId = user?.student_profile?.group_id || user?.curator_profile?.group_id || user?.group_id;

  // Безопасно вытаскиваем расписание дежурств из объекта группы
  const rawDuties = group?.weekly_duty || [];

  // Находим эту строчку в HomeViews.jsx и меняем маппинг users:
  const schedule = rawDuties.map(item => ({
    id: item.id,
    date: formatDutyDate(item.date),
    // Собираем полные имена всех дежурных за этот день в один массив
    users: item.students?.map(s => s.full_name) || ['Свободно'],
    status: item.status
  })).slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-5 select-none">

      {/* Компоненты теперь сами всё знают и не требуют лишних пропсов */}
      <GroupHeader isLoadingUser={isLoadingUser} />

      <div className="w-full flex justify-center">
        <DutyStack
          items={schedule}
          isLoading={isLoadingUser}
        />
      </div>

      <Leaderboard />

      {!groupId && !isLoadingUser && (
        <div className="mt-4 text-white/20 text-[10px] text-center px-10">
          Твой аккаунт не привязан к конкретной группе в базе данных.
        </div>
      )}
    </div>
  );
};

export default HomeView;