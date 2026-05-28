import React from 'react';

const DAY_LABELS = { 1: 'ПН', 2: 'ВТ', 3: 'СР', 4: 'ЧТ', 5: 'ПТ', 6: 'СБ', 7: 'ВС' };

function GroupSettingsInfo({ settings }) {
  const mechanismText = settings?.mechanism === 'alphabetical'
    ? 'Строго по алфавиту (очередь)'
    : 'Взвешенный (у кого меньше баллов)';

  const activeDays = settings?.work_days?.map(d => DAY_LABELS[d]).join(', ') || 'Не установлены';

  return (
    <div
      className="w-full bg-white/30 backdrop-blur-2xl border border-white/40 rounded-[32px] p-5 flex flex-col gap-4"
      style={{ filter: 'drop-shadow(0px 10px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0px 0px 15px rgba(191, 90, 242, 0.15))' }}
    >
      <div className="text-[10px] font-black uppercase italic tracking-wider text-white/60 pl-1 mb-1">
        Текущие правила вашей группы
      </div>

      {/* Карточка: Алгоритм */}
      <div className="w-full bg-white p-3.5 rounded-2xl shadow-md border border-white/20">
        <div className="text-[9px] font-bold uppercase text-slate-400 italic mb-0.5">Алгоритм распределения</div>
        <div className="font-extrabold text-[14px] text-slate-900 italic tracking-tight">{mechanismText}</div>
      </div>

      {/* Карточка: Дни */}
      <div className="w-full bg-white p-3.5 rounded-2xl shadow-md border border-white/20">
        <div className="text-[9px] font-bold uppercase text-slate-400 italic mb-0.5">Дни дежурств на неделе</div>
        <div className="font-extrabold text-[14px] text-slate-900 italic tracking-tight text-accent-purple">{activeDays}</div>
      </div>

      {/* Карточка: Количество */}
      <div className="w-full bg-white p-3.5 rounded-2xl shadow-md border border-white/20 flex justify-between items-center">
        <div>
          <div className="text-[9px] font-bold uppercase text-slate-400 italic mb-0.5">Плотность смены</div>
          <div className="font-extrabold text-[14px] text-slate-900 italic tracking-tight">Количество человек</div>
        </div>
        <span className="font-black text-lg text-slate-900 italic bg-slate-100 px-3 py-1 rounded-xl">
          {settings?.person_per_day || 2}
        </span>
      </div>
    </div>
  );
}

export default GroupSettingsInfo;