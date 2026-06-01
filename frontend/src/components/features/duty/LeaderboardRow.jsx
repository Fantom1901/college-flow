import React from 'react';
import WhiteCard from '../../ui/cards/WhiteCard.jsx';
import MiniAvatar from '../../ui/feedback/MiniAvatar.jsx';
import RankBadge from '../../ui/feedback/RankBadge.jsx';
import Typography from '../../ui/typography/Typography.jsx';

/**
 * LeaderboardRow - Строка одного студента в рейтинге
 * @param {number} rank - Место
 * @param {string} name - Имя студента
 * @param {number} points - Количество баллов
 * @param {boolean} [colorized=true] - Подсветка топа по цветам
 */
const LeaderboardRow = ({ rank, name, points = 0, colorized = true }) => {
  return (
    <WhiteCard size="sm" className="!justify-between py-2.5">
      {/* Левая часть: Место + Аватарка + Имя */}
      <div className="flex items-center gap-3">
        <RankBadge rank={rank} colorized={colorized} />
        <MiniAvatar name={name} />
        <Typography variant="cardTitleDark">
          {name}
        </Typography>
      </div>

      {/* Правая часть: Баллы */}
      <div className="flex items-center gap-1">
        <Typography variant="points">
          {points}
        </Typography>
        <span className="text-[10px] font-bold text-slate-400 italic uppercase">
          б
        </span>
      </div>
    </WhiteCard>
  );
};

export default LeaderboardRow;