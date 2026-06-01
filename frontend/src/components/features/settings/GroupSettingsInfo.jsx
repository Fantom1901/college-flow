import React from 'react';
import GlassCard from '../../ui/cards/GlassCard.jsx';
import WhiteCard from '../../ui/cards/WhiteCard.jsx';
import Typography from '../../ui/typography/Typography.jsx';

const DAY_LABELS = { 1: 'ПН', 2: 'ВТ', 3: 'СР', 4: 'ЧТ', 5: 'ПТ', 6: 'СБ', 7: 'ВС' };

function GroupSettingsInfo({ settings }) {
  const mechanismText = settings?.mechanism === 'alphabetical'
    ? 'Строго по алфавиту (очередь)'
    : 'Взвешенный (у кого меньше баллов)';

  const activeDays = settings?.work_days?.map(d => DAY_LABELS[d]).join(', ') || 'Не установлены';

  return (
    <GlassCard variant="form" className="gap-4">
      <Typography variant="label">
        Текущие правила вашей группы
      </Typography>

      {/* 1. Алгоритм */}
      <WhiteCard size="sm" className="flex-col items-start gap-0.5">
        <Typography variant="labelDark" className="!text-[9px]">Алгоритм распределения</Typography>
        <Typography variant="cardTitleDark">{mechanismText}</Typography>
      </WhiteCard>

      {/* 2. Дни */}
      <WhiteCard size="sm" className="flex-col items-start gap-0.5">
        <Typography variant="labelDark" className="!text-[9px]">Дни дежурств на неделе</Typography>
        <Typography variant="cardTitleDark" className="text-accent-purple">{activeDays}</Typography>
      </WhiteCard>

      {/* 3. Количество */}
      <WhiteCard size="sm" className="justify-between items-center">
        <div>
          <Typography variant="labelDark" className="!text-[9px]">Плотность смены</Typography>
          <Typography variant="cardTitleDark">Количество человек</Typography>
        </div>
        <span className="font-black text-lg text-slate-900 italic bg-slate-100 px-3 py-1 rounded-xl">
          {settings?.person_per_day || 2}
        </span>
      </WhiteCard>
    </GlassCard>
  );
}

export default GroupSettingsInfo;