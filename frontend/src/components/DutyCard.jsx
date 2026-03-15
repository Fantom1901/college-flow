import React from 'react';
import {motion} from "framer-motion";

const getInitials = (name) => {
  if (!name) return "??";
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

function DutyCard({
                    isActive = true,
                    width = '228px',
                    height = '125px',
                    zIndex = 1,
                    activeIndex = 0,
                    data // Добавляем проп data
                  }) {
  const { date = "Загрузка...", users = [] } = data || {};

  return (
    <div
      style={{ width, height, zIndex }}
      className="relative border border-duty shadow-duty backdrop-blur-duty bg-fill-secondary py-4 px-[14px] rounded-3xl flex flex-row justify-between transition-all duration-500"
    >
      {isActive ? (
        <>
          <div className="flex flex-col gap-[18px]">
            <div className="font-sans font-bold text-[13px] leading-[20px] tracking-[--tracking-sf-tight] text-label-secondary">
              {date} {/* Теперь дата динамическая */}
            </div>

            <div className="flex flex-col gap-2 text-white font-sans">
              {users.map((user, idx) => (
                <div key={idx} className="flex gap-[10px] items-center">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-active-point shrink-0">
                    <b className="font-semibold text-[11px] leading-none">
                      {getInitials(user)} {/* Инициалы считаются сами */}
                    </b>
                  </div>
                  <div>
                    <b className="font-bold text-[16px] leading-5 text-nowrap">
                      {user} {/* Имя из массива */}
                    </b>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-[3px]">
            {[0, 1, 2].map((dotIndex) => (
              <motion.span
                key={dotIndex}
                layout // Добавляем layout самой точке
                className={`
                  w-[5px] h-[5px] rounded-full shrink-0 transition-all duration-300
                  ${activeIndex === dotIndex
                    ? 'bg-active-point shadow-active-point scale-110'
                    : 'bg-label-quarternary'}
                `}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default DutyCard;