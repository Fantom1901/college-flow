import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dutyApi } from '../../api/duty';
import DutyStack from "../DutyStack.jsx";
import GroupHeader from "../GroupHeader.jsx";
import Leaderboard from "../Leaderboard.jsx"; // Импортируем наш топ
import { formatDutyDate } from '../../utils/dateFormatter';

const HomeView = ({ user, isLoadingUser }) => {
  const groupId = user?.student_profile?.group_id || user?.curator_profile?.group_id || user?.group_id;

  const { data: schedule, isLoading: isLoadingDuty } = useQuery({
    queryKey: ['weekly-duty', groupId],
    queryFn: () => dutyApi.getWeekly ? dutyApi.getWeekly(groupId) : dutyApi.getToday(groupId),
    enabled: !!groupId,
    select: (data) => data.map(item => ({
      id: item.id,
      date: formatDutyDate(item.date),
      users: [item.student?.full_name || 'Имя'],
      status: item.status
    })).slice(0, 3)
  });

  return (
    // Добавили h-full и распределили элементы: шапка, стек, и на весь остаток — топ
    <div className="flex flex-col items-center justify-start w-full h-full gap-5 select-none">

      <GroupHeader groupId={groupId} isLoadingUser={isLoadingUser} />

      <div className="w-full flex justify-center">
        <DutyStack
          items={schedule || []}
          isLoading={isLoadingUser || (isLoadingDuty && !!groupId) || !groupId}
        />
      </div>

      {/* Компонент Топа забирает все оставшееся место на экране */}
      <Leaderboard groupId={groupId} />

      {!groupId && !isLoadingUser && (
        <div className="mt-4 text-white/20 text-[10px] text-center px-10">
          Твой аккаунт не привязан к конкретной группе в базе данных.
        </div>
      )}
    </div>
  );
};

export default HomeView;