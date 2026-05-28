import React from 'react';
import { Check, X, Ban } from 'lucide-react';

export const ExchangeActions = ({ exchangeId, activeTab, status, onUpdateStatus, isLoading }) => {

  // 1. Если это вкладка ИСТОРИИ — выводим только текстовый статус
  if (activeTab === 'history') {
    if (status === 'accepted') {
      return (
        <span className="text-accent-green font-black text-[11px] uppercase italic tracking-widest bg-accent-green/10 px-3 py-1 rounded-full">
          Принято
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="text-accent-red font-black text-[11px] uppercase italic tracking-widest bg-accent-red/10 px-3 py-1 rounded-full">
          Отклонено
        </span>
      );
    }
    return (
      <span className="text-slate-400 font-black text-[11px] uppercase italic tracking-widest bg-white/5 px-3 py-1 rounded-full">
        Отменено
      </span>
    );
  }

  // 2. Если это вкладка ИСХОДЯЩИХ — кнопка отмены своего предложения
  if (activeTab === 'outgoing') {
    return (
      <button
        disabled={isLoading}
        onClick={() => onUpdateStatus(exchangeId, 'cancelled')}
        className="flex items-center gap-1.5 h-8 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all outline-none disabled:opacity-50"
      >
        <Ban size={14} className="text-accent-orange" />
        <span className="text-accent-orange font-extrabold text-[12px] uppercase italic tracking-wider">
          {isLoading ? 'Отмена...' : 'Отменить'}
        </span>
      </button>
    );
  }

  // 3. Если это вкладка ВХОДЯЩИХ — кнопки принять или отклонить
  return (
    <div className="flex items-center gap-2 w-full justify-between">
      {/* Кнопка Отклонить */}
      <button
        disabled={isLoading}
        onClick={() => onUpdateStatus(exchangeId, 'rejected')}
        className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all outline-none disabled:opacity-50"
      >
        <X size={14} className="text-accent-red" />
        <span className="text-accent-red font-extrabold text-[12px] uppercase italic tracking-wider">
          Отклонить
        </span>
      </button>

      {/* Кнопка Принять */}
      <button
        disabled={isLoading}
        onClick={() => onUpdateStatus(exchangeId, 'accepted')}
        className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 active:scale-95 transition-all outline-none disabled:opacity-50"
      >
        <Check size={14} className="text-accent-green" />
        <span className="text-accent-green font-extrabold text-[12px] uppercase italic tracking-wider">
          Принять
        </span>
      </button>
    </div>
  );
};

export default ExchangeActions;