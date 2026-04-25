import { useQuery } from '@tanstack/react-query'; // Вот этого не хватало
import { dutyApi } from '../../api/duty';
import DutyStack from "../DutyStack.jsx";
import { formatDutyDate } from '../../utils/dateFormatter';

const HomeView = ({ user, isLoadingUser }) => {
  // Пытаемся вытащить группу
  const groupId = user?.student_profile?.group_id || user?.group_id;

  const { data: schedule, isLoading: isLoadingDuty } = useQuery({
    queryKey: ['weekly-duty', groupId],
    queryFn: () => dutyApi.getWeekly(groupId),
    enabled: !!groupId,
    select: (data) => data.map(item => ({
      id: item.id,
      date: formatDutyDate(item.date),
      users: [item.student?.full_name || 'Имя'],
      status: item.status
    })).slice(0, 3)
  });

  return (
    <div className="flex flex-col items-center w-full select-none">
      <header className="w-full flex justify-center">
        {/* Если группы нет, покажем пустой стек (скелетоны) */}
        <DutyStack
          items={schedule || []}
          isLoading={isLoadingUser || (isLoadingDuty && !!groupId) || !groupId}
        />
      </header>

      {!groupId && !isLoadingUser && (
        <div className="mt-10 text-white/20 text-[10px] text-center px-10">
          Твой аккаунт куратора не привязан к конкретной группе в базе данных.
        </div>
      )}
    </div>
  );
};

export default HomeView;