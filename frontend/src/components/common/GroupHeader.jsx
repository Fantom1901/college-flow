import React from 'react';
import useGroupStore from '../../store/useGroupStore.js';
import Typography from '../ui/typography/Typography.jsx';

function GroupHeader({ isLoadingUser }) {
  const group = useGroupStore((state) => state.group);

  if (isLoadingUser) {
    return (
      <div className="w-full flex flex-col items-center gap-1.5 py-4 animate-pulse">
        <div className="h-7 w-36 bg-white/10 rounded-lg" />
        <div className="h-3 w-20 bg-white/5 rounded-md" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center text-center py-1 select-none">
      <Typography variant="h1">
        {group?.name || "Без группы"}
      </Typography>
      <Typography variant="sub">
        Моя группа
      </Typography>
    </div>
  );
}

export default GroupHeader;