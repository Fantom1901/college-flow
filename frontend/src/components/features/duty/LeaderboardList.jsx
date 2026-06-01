import React from 'react';
import GlassCard from '../../ui/cards/GlassCard.jsx';
import LeaderboardRow from './LeaderboardRow.jsx';

/**
 * LeaderboardList - Полный стеклянный блок лидераборда
 * @param {Array<{id: string|number, full_name: string, points: number}>} data - Массив студентов
 * @param {boolean} [colorized=true] - Красить ли топ-3
 * @param {number} [limit=5] - Сколько человек показывать (0 - без лимита)
 */
const LeaderboardList = ({ data = [], colorized = true, limit = 5 }) => {
  // Обрезаем данные, если передан лимит
  const displayData = limit > 0 ? data.slice(0, limit) : data;

  return (
    <GlassCard variant="form" className="max-h-[60vh] !p-4 min-h-0">
      <div className="w-full flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-none">
        {displayData.map((student, index) => (
          <LeaderboardRow
            key={student.id}
            rank={index + 1}
            name={student.full_name}
            points={student.points}
            colorized={colorized}
          />
        ))}

        {displayData.length === 0 && (
          <div className="text-center my-auto text-slate-500 text-xs italic py-8">
            Список студентов пуст
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default LeaderboardList;