import React from 'react';

/**
 * RankBadge - Компонент для отображения места в рейтинге
 * @param {number} rank - Номер места (1, 2, 3...)
 * @param {boolean} [colorized=true] - Включить ли подсветку для топ-3
 */
const RankBadge = ({ rank, colorized = true }) => {
  const getRankStyle = () => {
    if (!colorized) return 'text-slate-400 font-bold';

    switch (rank) {
      case 1: return 'text-amber-500 font-black'; // Золото
      case 2: return 'text-slate-400 font-black'; // Серебро
      case 3: return 'text-amber-700 font-black'; // Бронза
      default: return 'text-slate-400 font-bold'; // Все остальные
    }
  };

  return (
    <span className={`text-[13px] italic w-4 text-center ${getRankStyle()}`}>
      {rank}
    </span>
  );
};

export default RankBadge;