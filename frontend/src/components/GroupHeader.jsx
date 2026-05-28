import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { groupsApi } from '../api/groups';
import useGroupStore from '../store/useGroupStore';

function GroupHeader({ groupId, isLoadingUser }) {
  const setGroup = useGroupStore((state) => state.setGroup);

  const { data: groupData, isLoading: isLoadingGroup } = useQuery({
    queryKey: ['myGroup', groupId],
    queryFn: groupsApi.getMy,
    enabled: !!groupId, // Запрос пойдет только если у юзера есть группа
  });

  // Закидываем группу в Zustand, чтобы докбар и другие модули её видели
  useEffect(() => {
    if (groupData) {
      setGroup(groupData);
    }
  }, [groupData, setGroup]);

  if (isLoadingUser || isLoadingGroup) {
    return (
      <div className="w-full flex flex-col items-center gap-1.5 py-4 animate-pulse">
        <div className="h-7 w-36 bg-white/10 rounded-lg" />
        <div className="h-3 w-20 bg-white/5 rounded-md" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center text-center py-1 select-none">
      <h1 className="font-extrabold text-[24px] text-white tracking-tight italic drop-shadow-md">
        {groupData?.name || "Без группы"}
      </h1>
      <span className="text-[11px] font-black uppercase tracking-widest text-white/50 italic mt-0.5">
        Моя группа
      </span>
    </div>
  );
}

export default GroupHeader;