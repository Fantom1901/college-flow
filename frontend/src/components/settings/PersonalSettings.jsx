import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { tgHaptics } from "../../../services/telegram/index.js";

function PersonalSettings() {
  const [notify, setNotify] = useState(true);

  const handleToggle = () => {
    // Мягкий щелчок при переключении тумблера уведомлений
    tgHaptics.selection();
    setNotify(!notify);
  };

  return (
    <div className="w-full flex flex-col gap-2 mt-2">
      <div className="text-[10px] font-black uppercase italic tracking-wider text-white/50 pl-4">
        Личные настройки
      </div>

      <div className="w-full bg-white shadow-md border border-white/20 rounded-2xl py-3 px-4 flex items-center justify-between">
        <b className="font-extrabold text-[14px] text-slate-900 tracking-tight italic">
          Напоминания в Telegram
        </b>

        {/* Основа тумблера */}
        <button
          onClick={handleToggle}
          className={`w-12 h-6 rounded-full p-0.5 outline-none transition-colors duration-300 flex ${
            notify ? 'bg-slate-950 justify-end' : 'bg-slate-200 justify-start'
          }`}
        >
          {/* Кругляшок с layout-анимацией */}
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
            className="bg-white w-5 h-5 rounded-full shadow-md"
          />
        </button>
      </div>
    </div>
  );
}

export default PersonalSettings;