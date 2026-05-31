import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tgHaptics } from '../../services/telegram/tgHaptics';

const DAYS_OF_WEEK = [
  { id: 1, label: 'ПН' },
  { id: 2, label: 'ВТ' },
  { id: 3, label: 'СР' },
  { id: 4, label: 'ЧТ' },
  { id: 5, label: 'ПТ' },
  { id: 6, label: 'СБ' },
];

function GroupSettingsForm({ initialSettings, onSave, isPending }) {
  const [mechanism, setMechanism] = useState(initialSettings?.mechanism || 'alphabetical');
  const [workDays, setWorkDays] = useState(initialSettings?.work_days || [1, 2, 3, 4, 5]);
  const [personPerDay, setPersonPerDay] = useState(initialSettings?.person_per_day || 2);

  const handleMechanismChange = (type) => {
    if (mechanism !== type) {
      tgHaptics.selection();
      setMechanism(type);
    }
  };

  const handleDayToggle = (dayId) => {
    tgHaptics.selection();
    setWorkDays(prev =>
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId].sort()
    );
  };

  const incrementPerson = () => {
    if (personPerDay >= 5) {
      // Вибрируем предупреждением, если упёрлись в потолок
      tgHaptics.notification('warning');
      return;
    }
    tgHaptics.selection();
    setPersonPerDay(p => p + 1);
  };

  const decrementPerson = () => {
    if (personPerDay <= 1) {
      // Вибрируем предупреждением, если упёрлись в пол
      tgHaptics.notification('warning');
      return;
    }
    tgHaptics.selection();
    setPersonPerDay(p => p - 1);
  };

  const handleFormSubmit = async () => {
    try {
      await onSave({ mechanism, work_days: workDays, person_per_day: personPerDay });
      // Сочный нативный успех после завершения отправки
      tgHaptics.notification('success');
    } catch (e) {
      // Если бэк вернул ошибку — вибрируем ошибкой
      tgHaptics.notification('error');
    }
  };

  return (
    <div
      className="w-full bg-white/30 backdrop-blur-2xl border border-white/40 rounded-[32px] p-5 flex flex-col gap-5"
      style={{ filter: 'drop-shadow(0px 10px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0px 0px 15px rgba(191, 90, 242, 0.15))' }}
    >
      {/* 1. Выбор механизма */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase italic tracking-wider text-white/60 pl-1">
          Алгоритм распределения
        </label>
        <div className="flex relative bg-slate-950/20 p-1 rounded-2xl border border-white/10 overflow-hidden">
          <button
            onClick={() => handleMechanismChange('alphabetical')}
            className={`flex-1 py-2 text-xs font-extrabold italic rounded-xl relative outline-none transition-colors duration-300 ${
              mechanism === 'alphabetical' ? 'text-slate-950' : 'text-white/60'
            }`}
          >
            {mechanism === 'alphabetical' && (
              <motion.div
                layoutId="active-mechanism-pill"
                className="absolute inset-0 bg-white rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">По алфавиту</span>
          </button>
          <button
            onClick={() => handleMechanismChange('weighted')}
            className={`flex-1 py-2 text-xs font-extrabold italic rounded-xl relative outline-none transition-colors duration-300 ${
              mechanism === 'weighted' ? 'text-slate-950' : 'text-white/60'
            }`}
          >
            {mechanism === 'weighted' && (
              <motion.div
                layoutId="active-mechanism-pill"
                className="absolute inset-0 bg-white rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">По баллам</span>
          </button>
        </div>
      </div>

      {/* 2. Дни дежурств */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase italic tracking-wider text-white/60 pl-1">
          Дни дежурств
        </label>
        <div className="grid grid-cols-6 gap-1.5 bg-slate-950/20 p-1.5 rounded-2xl border border-white/10 relative overflow-hidden">
          {DAYS_OF_WEEK.map((day) => {
            const isActive = workDays.includes(day.id);
            return (
              <button
                key={day.id}
                onClick={() => handleDayToggle(day.id)}
                className={`h-10 text-xs font-black italic rounded-xl relative outline-none transition-colors duration-300 ${
                  isActive ? 'text-slate-950' : 'text-white/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={`active-day-pill-${day.id}`}
                    className="absolute inset-0 bg-white rounded-xl shadow-md"
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  />
                )}
                <motion.span className="relative z-10 block" whileTap={{ scale: 0.85 }}>
                  {day.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Количество человек */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase italic tracking-wider text-white/60 pl-1">
          Студентов на день
        </label>
        <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl shadow-lg border border-white/20">
          <motion.button
            whileTap={{ scale: 0.85 }}
            disabled={personPerDay <= 1}
            onClick={decrementPerson}
            className="w-9 h-9 rounded-xl bg-slate-100 font-black text-slate-900 flex items-center justify-center disabled:opacity-20 outline-none"
          >
            -
          </motion.button>
          <div className="h-6 overflow-hidden relative w-20 flex justify-center items-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={personPerDay}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="font-black text-slate-900 italic text-base absolute"
              >
                {personPerDay} чел.
              </motion.span>
            </AnimatePresence>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            disabled={personPerDay >= 5}
            onClick={incrementPerson}
            className="w-9 h-9 rounded-xl bg-slate-100 font-black text-slate-900 flex items-center justify-center disabled:opacity-20 outline-none"
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Кнопка сохранения вызывает колбэк из пропсов */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleFormSubmit}
        disabled={isPending}
        className="w-full mt-2 py-3.5 bg-slate-950 text-white font-black italic tracking-wide rounded-2xl shadow-lg border border-white/10 outline-none"
      >
        {isPending ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ НАСТРОЙКИ'}
      </motion.button>
    </div>
  );
}

export default GroupSettingsForm;