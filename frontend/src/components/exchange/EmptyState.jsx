import React from 'react';
import { Clock } from 'lucide-react';
import Typography from "../ui/typography/Typography.jsx";

/**
 * EmptyState - Состояние пустого списка
 * @param {'incoming' | 'outgoing' | 'history'} activeTab
 */
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
      <Typography variant="badge" className="text-slate-400 text-center">
        {text}
      </Typography>
    </div>
  );
};

export default EmptyState;