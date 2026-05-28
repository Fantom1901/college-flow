import React from 'react';
import { Clock } from 'lucide-react';

export const EmptyState = ({ activeTab }) => {
  const messages = {
    incoming: 'Входящих заявок пока нет',
    outgoing: 'Вы не отправляли запросов',
    history: 'История обменов пуста',
  };

  const text = messages[activeTab] || 'Заявок не найдено';

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center gap-3 opacity-60">
      <Clock
        size={32}
        className="text-slate-400 animate-pulse"
      />
      <span className="font-extrabold text-[13px] uppercase italic tracking-wider text-slate-400 text-center">
        {text}
      </span>
    </div>
  );
};

export default EmptyState;