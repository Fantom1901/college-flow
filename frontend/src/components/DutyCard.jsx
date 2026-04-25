import React from 'react';
import { motion } from "framer-motion";
import { IS_DEV, MOCK_DUTY } from '../config';
console.log("DEBUG CONFIG:", { IS_DEV, MOCK_DUTY }); // ЧТО ТУТ?

const getInitials = (name) => {
  if (!name) return "";
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

function DutyCard({
                    isActive = true,
                    width = '228px',
                    height = '125px',
                    zIndex = 1,
                    activeIndex = 0,
                    data,
                    isLoading = false
                  }) {

  // 1. Определяем, есть ли у нас реальные данные
  const hasRealData = data && Object.keys(data).length > 0 && data.date;

  // 2. Выбираем, что отрисовать
  let displayData = data;

  if (IS_DEV && !hasRealData) {
    displayData = MOCK_DUTY[activeIndex % MOCK_DUTY.length];
  }
  const date = displayData?.date || "Дата не указана";
  const users = displayData?.users || [];

  console.log("RENDER LOG:", {
    source: hasRealData ? "SERVER/PROPS" : "MOCK",
    date,
    usersCount: users.length
  });

  if (isLoading) {
    return (
      <div style={{ width, height, zIndex }} className={`relative p-4 rounded-[28px] flex flex-row justify-between transition-all duration-500 shadow-xl
      ${isActive ? 'bg-white/90 backdrop-blur-xl' : 'bg-white/40 backdrop-blur-md'} border border-white/40`}>
        <div className="flex flex-col gap-[18px] w-full">
          <div className="h-4 w-24 bg-black/5 rounded-md" />
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 rounded-full bg-black/5" />
              <div className="h-5 w-32 bg-black/5 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ width, height, zIndex }}
      className={`relative inner-glass p-4 rounded-[28px] flex flex-row justify-between transition-all duration-500 shadow-lg`}
    >
      <div className={`flex flex-col justify-between transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-slate-500 text-[10px] font-black uppercase italic tracking-wider">
          {date}
        </div>

        <div className="flex flex-col gap-2">
          {users.map((user, idx) => (
            <div key={idx} className="flex gap-[10px] items-center">
              <div className="w-7 h-7 flex items-center justify-center rounded-xl bg-slate-900 shadow-lg shrink-0">
                <b className="text-white text-[10px] italic">{getInitials(user)}</b>
              </div>
              <b className="font-extrabold text-[15px] text-slate-900 tracking-tight italic">
                {user}
              </b>
            </div>
          ))}
          {/* Если пользователей нет, покажем заглушку внутри карточки */}
          {users.length === 0 && <b className="text-slate-400 text-[12px]">Свободно</b>}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-[4px]">
        {[0, 1, 2].map((dotIndex) => (
          <motion.span
            key={dotIndex}
            layout
            className={`w-[6px] h-[6px] rounded-full shrink-0 transition-all duration-300 ${
              activeIndex === dotIndex
                ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)] scale-125'
                : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default DutyCard;