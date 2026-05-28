import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dutyApi } from '../../api/duty';
import DutyStack from "../DutyStack.jsx";
import GroupHeader from "../GroupHeader.jsx";
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
    // Чистый поток: gap-6 делает фиксированный красивый отступ между заголовком и стеком карточек
    <div className="flex flex-col items-center justify-start w-full gap-6 select-none">

      {/* Название группы на самом верху */}
      <GroupHeader groupId={groupId} isLoadingUser={isLoadingUser} />

      {/* Стек карточек ложится сразу под ней */}
      <div className="w-full flex justify-center">
        <DutyStack
          items={schedule || []}
          isLoading={isLoadingUser || (isLoadingDuty && !!groupId) || !groupId}
        />
      </div>

      {!groupId && !isLoadingUser && (
        <div className="mt-4 text-white/20 text-[10px] text-center px-10">
          Твой аккаунт не привязан к конкретной группе в базе данных.
        </div>
      )}
    </div>
  );
};

export default HomeView;