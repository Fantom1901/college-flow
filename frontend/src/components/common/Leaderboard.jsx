import React from 'react';
import useGroupStore from '../../store/useGroupStore.js';
import { getInitials } from '../../utils/avatar.js';

function Leaderboard() {
  // Вытаскиваем данные группы напрямую из Zustand-стора
  const group = useGroupStore((state) => state.group);

  // Достаем массив рейтинга из объекта группы (зашит в моках или прилетает с бэка)
  const leaderboardData = group?.leaderboard || [];

  // Обрезаем массив до топ-5 через .slice(0, 5)
  const displayData = leaderboardData.slice(0, 5);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 mt-2">
      {/* Заголовок секции */}
      <div className="text-[10px] font-black uppercase italic tracking-wider text-white/50 mb-2 pl-4">
        Рейтинг группы по баллам
      </div>

      <div
        className="w-full max-h-[60vh] bg-white/30 backdrop-blur-2xl border border-white/40 rounded-[32px] p-4 flex flex-col min-h-0"
        style={{
          filter: 'drop-shadow(0px 10px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0px 0px 15px rgba(191, 90, 242, 0.15))'
        }}
      >
        {/* Внутренний контейнер списка */}
        <div className="w-full flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-none">
          {displayData.map((student, index) => {
            const place = index + 1;

            const placeColor =
              place === 1 ? 'text-amber-500 font-black' :
                place === 2 ? 'text-slate-400 font-black' :
                  place === 3 ? 'text-amber-700 font-black' : 'text-slate-400 font-bold';

            return (
              <div
                key={student.id}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-2xl bg-white shadow-md border border-white/20 transition-all duration-200"
              >
                {/* Левая часть: Место + Аватарка + Имя */}
                <div className="flex items-center gap-3">
                  <span className={`text-[13px] italic w-4 text-center ${placeColor}`}>
                    {place}
                  </span>

                  {/* Тёмная аватарка */}
                  <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900 shadow-sm shrink-0">
                    <b className="text-white text-[11px] italic">
                      {getInitials(student.full_name)}
                    </b>
                  </div>

                  {/* Имя студента */}
                  <b className="font-extrabold text-[14px] text-slate-900 tracking-tight italic">
                    {student.full_name}
                  </b>
                </div>

                {/* Правая часть: Баллы */}
                <div className="flex items-center gap-1">
                  <span className="font-black text-[15px] text-slate-900 italic tracking-tight">
                    {student.points || 0}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 italic uppercase">
                    б
                  </span>
                </div>
              </div>
            );
          })}

          {displayData.length === 0 && (
            <div className="text-center my-auto text-slate-500 text-xs italic py-8">
              Список студентов пуст
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;