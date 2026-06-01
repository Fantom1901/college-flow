import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import GlassCard from '../../ui/cards/GlassCard.jsx';
import MiniAvatar from '../../ui/feedback/MiniAvatar.jsx';
import Typography from '../../ui/typography/Typography.jsx';

export const ExchangeCard = ({ request, children }) => {
  const initiatorName = request.initiator_duty?.student?.full_name || 'Неизвестно';
  const suggestedName = request.suggested_duty?.student?.full_name || 'Неизвестно';

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '—';

  return (
    <GlassCard variant="exchange">
      <div className="flex items-center justify-between gap-2">
        {/* Инициатор */}
        <div className="flex flex-col gap-2 flex-1">
          <Typography variant="labelDark">{formatDate(request.initiator_duty?.date)}</Typography>
          <div className="flex gap-[10px] items-center">
            <MiniAvatar name={initiatorName} />
            <Typography variant="cardTitleDark" className="truncate max-w-[85px]">
              {initiatorName.split(' ')[0]}
            </Typography>
          </div>
        </div>

        {/* Иконка */}
        <div className="flex items-center justify-center p-2 shrink-0">
          <ArrowLeftRight
            size={20}
            className="text-accent-purple"
            style={{ filter: 'drop-shadow(0px 0px 8px rgba(191, 90, 242, 0.8))' }}
          />
        </div>

        {/* Оппонент */}
        <div className="flex flex-col gap-2 flex-1 items-end text-right">
          <Typography variant="labelDark">{formatDate(request.suggested_duty?.date)}</Typography>
          <div className="flex gap-[10px] items-center flex-row-reverse">
            <MiniAvatar name={suggestedName} />
            <Typography variant="cardTitleDark" className="truncate max-w-[85px]">
              {suggestedName.split(' ')[0]}
            </Typography>
          </div>
        </div>
      </div>

      {children && (
        <div className="w-full pt-2 border-t border-white/10 flex justify-end items-center gap-3">
          {children}
        </div>
      )}
    </GlassCard>
  );
};

export default ExchangeCard;