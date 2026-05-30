import React from 'react';
import useGroupStore from '../../store/useGroupStore.js';

function GroupHeader({ isLoadingUser }) {
  // Достаем объект группы напрямую из Zustand-стора
  const group = useGroupStore((state) => state.group);

  // Состояние загрузки теперь зависит только от инициализации юзера/приложения
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
      <h1 className="font-extrabold text-[24px] text-white tracking-tight italic drop-shadow-md">
        {group?.name || "Без группы"}
      </h1>
      <span className="text-[11px] font-black uppercase tracking-widest text-white/50 italic mt-0.5">
        Моя группа
      </span>
    </div>
  );
}

export default GroupHeader;