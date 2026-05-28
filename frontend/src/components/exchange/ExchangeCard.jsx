import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { getInitials } from '../../utils/avatar.js';

export const ExchangeCard = ({ request, activeTab, children }) => {
  // Вытаскиваем нужные данные из объекта обмена, подстраховываясь на случай пустых полей
  const initiatorName = request.initiator_duty?.student?.full_name || 'Неизвестно';
  const suggestedName = request.suggested_duty?.student?.full_name || 'Неизвестно';

  const initiatorDate = request.initiator_duty?.date
    ? new Date(request.initiator_duty.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : '—';

  const suggestedDate = request.suggested_duty?.date
    ? new Date(request.suggested_duty.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : '—';

  return (
    <div
      className="w-full main-glass rounded-[28px] p-5 flex flex-col gap-4 border border-white/20 transition-all duration-300"
      style={{
        '--glass-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
    >

      {/* Верхний ряд: Кто с кем меняется */}
      <div className="flex items-center justify-between gap-2">

        {/* Блок Инициатора (Слева) */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-slate-500 text-[10px] font-black uppercase italic tracking-wider">
            {initiatorDate}
          </span>
          <div className="flex gap-[10px] items-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900 shadow-lg shrink-0 border border-white/10">
              <b className="text-white text-[11px] italic">{getInitials(initiatorName)}</b>
            </div>
            <b className="font-extrabold text-[14px] text-slate-900 tracking-tight italic truncate max-w-[85px]">
              {initiatorName.split(' ')[0]}
            </b>
          </div>
        </div>

        {/* Центральная иконка с неоновым фиолетовым свечением */}
        <div className="flex items-center justify-center p-2 shrink-0">
          <ArrowLeftRight
            size={20}
            className="text-accent-purple"
            style={{ filter: 'drop-shadow(0px 0px 8px rgba(191, 90, 242, 0.8))' }}
          />
        </div>

        {/* Блок Оппонента (Справа) */}
        <div className="flex flex-col gap-2 flex-1 items-end text-right">
          <span className="text-slate-500 text-[10px] font-black uppercase italic tracking-wider">
            {suggestedDate}
          </span>
          <div className="flex gap-[10px] items-center flex-row-reverse">
            <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900 shadow-lg shrink-0 border border-white/10">
              <b className="text-white text-[11px] italic">{getInitials(suggestedName)}</b>
            </div>
            <b className="font-extrabold text-[14px] text-slate-900 tracking-tight italic truncate max-w-[85px]">
              {suggestedName.split(' ')[0]}
            </b>
          </div>
        </div>

      </div>

      {/* Нижняя часть карточки, куда прокинутся кнопки действий или статусы */}
      {children && (
        <div className="w-full pt-2 border-t border-white/10 flex justify-end items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExchangeCard;