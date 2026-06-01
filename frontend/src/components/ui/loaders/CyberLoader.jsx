import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CyberLoader = ({ status = 'loading' }) => {
  // =========================================================================
  // 🎛️ ЦЕНТРАЛЬНАЯ ПАНЕЛЬ УПРАВЛЕНИЯ
  // =========================================================================
  const LOADER_CONFIG = {
    size: 60,
    totalTicks: 18,
    tickWidth: 4,
    tickHeight: 11,
    iconStrokeWidth: 3.5,
    targetTailLength: 12, // Длина шлейфа кометы
    baseIntervalMs: 20,   // Базовый шаг таймера
    finalDelayMs: 150,    // Задержка перед иконкой в волне
    glowBlur: '12px',
    glowSpread: '2px',
    glowAlpha: 0.2,
  };

  const COLORS_CONFIG = {
    loading: { bg: 'bg-purple-400', glow: `rgba(168, 85, 247, ${LOADER_CONFIG.glowAlpha})` },
    success: { bg: 'bg-green-500', glow: `rgba(34, 197, 94, ${LOADER_CONFIG.glowAlpha})` },
    error: { bg: 'bg-red-500', glow: `rgba(239, 68, 68, ${LOADER_CONFIG.glowAlpha})` }
  };
  // =========================================================================

  const { totalTicks, targetTailLength, baseIntervalMs, finalDelayMs } = LOADER_CONFIG;

  const [headPos, setHeadPos] = useState(targetTailLength);
  const [tailPos, setTailPos] = useState(0);
  const [tickColors, setTickColors] = useState(Array(totalTicks).fill('loading'));
  const [displayStatus, setDisplayStatus] = useState('loading');

  // Флаг, который зажигает все тики на 100% (когда кольцо замкнулось)
  const [isRingClosed, setIsRingClosed] = useState(false);
  // Специальный стейт, чтобы включать плавное переливание только когда нам нужно
  const [colorTransition, setColorTransition] = useState('0ms');

  const stateRef = useRef({
    head: targetTailLength,
    tail: 0,
    mode: 'loading',
    status: 'loading',
    waveInterval: null,
    colorsArray: Array(totalTicks).fill('loading')
  });

  // 1. СМОТРИТЕЛЬ СТАТУСОВ (Переключает режимы)
  useEffect(() => {
    const state = stateRef.current;
    if (state.status !== status) {
      const prevStatus = state.status;
      state.status = status;

      if (status === 'loading') {
        state.mode = 'loading';
        setIsRingClosed(false);
        setColorTransition('0ms');
        setDisplayStatus('loading');
        state.head = targetTailLength;
        state.tail = 0;
        setHeadPos(targetTailLength);
        setTailPos(0);
        state.colorsArray = Array(totalTicks).fill('loading');
        setTickColors([...state.colorsArray]);
        if (state.waveInterval) clearInterval(state.waveInterval);

      } else if (prevStatus === 'loading') {
        // Запускаем режим догоняния! (Сам процесс идет во втором useEffect)
        state.mode = 'catching_up';

      } else {
        // ТВОЯ ЛЮБИМАЯ ВОЛНА (Успех <-> Ошибка)
        state.mode = 'wave';
        setIsRingClosed(true);
        setColorTransition('0ms'); // Волна должна быть резкой, без размытия цветов!

        const startIdx = status === 'success' ? Math.floor(totalTicks / 2) : 0;
        state.colorsArray = Array(totalTicks).fill(prevStatus);
        state.colorsArray[startIdx] = status;
        setTickColors([...state.colorsArray]);

        let currentStep = 1;
        if (state.waveInterval) clearInterval(state.waveInterval);
        state.waveInterval = setInterval(() => {
          const targetIdx = (startIdx + currentStep) % totalTicks;
          state.colorsArray[targetIdx] = status;
          setTickColors([...state.colorsArray]);

          currentStep++;
          if (currentStep >= totalTicks) {
            clearInterval(state.waveInterval);
            state.waveInterval = null;
            setTimeout(() => setDisplayStatus(status), finalDelayMs);
          }
        }, baseIntervalMs);
      }
    }
  }, [status, totalTicks, targetTailLength, baseIntervalMs, finalDelayMs]);

  // 2. ДВИЖОК КОМЕТЫ (Обычное вращение и догоняние)
  useEffect(() => {
    let tickCounter = 0;
    const interval = setInterval(() => {
      const state = stateRef.current;
      tickCounter++;

      if (state.mode === 'loading') {
        // Обычный бег: хвост и голова идут синхронно
        if (tickCounter % 4 === 0) {
          state.tail = (state.tail + 1) % totalTicks;
          state.head = (state.head + 1) % totalTicks;
          setHeadPos(state.head);
          setTailPos(state.tail);
        }
      } else if (state.mode === 'catching_up') {
        // РЕЖИМ ДОГОНЯНИЯ ИЗ ТВОЕЙ ГОЛОВЫ:

        // 1. Хвост не останавливается! Крутится так же (каждые 4 тика)
        if (tickCounter % 4 === 0) {
          state.tail = (state.tail + 1) % totalTicks;
          setTailPos(state.tail);
        }

        // 2. Голова ускоряется в 2 раза (каждые 2 тика) и нагоняет хвост
        if (tickCounter % 2 === 0) {
          state.head = (state.head + 1) % totalTicks;
          setHeadPos(state.head);
        }

        // Когда голова догнала хвост:
        if (state.head === state.tail) {
          state.mode = 'solid_purple_pause';
          setIsRingClosed(true); // Кольцо становится 100% видимым (фиолетовым)

          // 3. Держим фиолетовое кольцо ровно 0.2 секунды (200мс)
          setTimeout(() => {

            // 4. Включаем плавное переливание и красим ВЕСЬ круг разом
            setColorTransition('300ms');
            state.colorsArray = Array(totalTicks).fill(status);
            setTickColors([...state.colorsArray]);

            // Ждем 300мс пока цвета перетекут, и показываем иконку
            setTimeout(() => {
              setDisplayStatus(status);

              // Выключаем переливание, чтобы будущие волны работали четко
              setTimeout(() => setColorTransition('0ms'), 50);
            }, 300);
          }, 230);
        }
      }
    }, baseIntervalMs);

    return () => clearInterval(interval);
  }, [status, totalTicks, baseIntervalMs]);

  // Длительность прорисовки иконки
  const waveDurationSeconds = (totalTicks * baseIntervalMs) / 1000;
  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1, transition: { duration: waveDurationSeconds, ease: "easeInOut" } },
    exit: { pathLength: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="relative" style={{ width: LOADER_CONFIG.size, height: LOADER_CONFIG.size }}>
      {/* Слой с тиками */}
      <div className="absolute inset-0">
        {Array.from({ length: totalTicks }).map((_, index) => {
          let opacity = 0;
          let currentStatusKey = tickColors[index];
          let currentTickColor = COLORS_CONFIG[currentStatusKey].bg;

          // Логика видимости
          if (isRingClosed) {
            opacity = 1;
          } else {
            const isInsideLength = headPos >= tailPos
              ? (index >= tailPos && index <= headPos)
              : (index >= tailPos || index <= headPos);

            if (isInsideLength) {
              const distanceToHead = (headPos - index + totalTicks) % totalTicks;
              const currentLength = (headPos - tailPos + totalTicks) % totalTicks;
              opacity = currentLength > 0 ? 1 - (distanceToHead / (currentLength + 1)) : 1;
            }
          }

          const shadowColor = COLORS_CONFIG[currentStatusKey].glow;
          let boxShadowStyle = opacity > 0 ? `0 0 ${LOADER_CONFIG.glowBlur} ${LOADER_CONFIG.glowSpread} ${shadowColor}` : 'none';

          return (
            <div
              key={index}
              className="absolute"
              style={{
                width: LOADER_CONFIG.tickWidth,
                height: '50%',
                left: '50%',
                marginLeft: `-${LOADER_CONFIG.tickWidth / 2}px`,
                transformOrigin: 'bottom',
                transform: `rotate(${(index * 360) / totalTicks}deg)`
              }}
            >
              <div
                className="rounded-full bg-slate-800/10 relative"
                style={{ width: LOADER_CONFIG.tickWidth, height: LOADER_CONFIG.tickHeight }}
              >
                {/* Тот самый плавный fade для цветов */}
                <motion.div
                  className={`w-full h-full rounded-full ${currentTickColor}`}
                  animate={{ opacity: opacity }}
                  transition={{ duration: 0.05 }}
                  style={{
                    boxShadow: boxShadowStyle,
                    transitionProperty: 'background-color, box-shadow',
                    transitionDuration: colorTransition,
                    transitionTimingFunction: 'ease-in-out'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Слой с иконкой */}
      <AnimatePresence mode="wait">
        {status !== 'loading' && displayStatus === status && (
          <motion.div
            key={displayStatus}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ filter: `drop-shadow(0 0 ${LOADER_CONFIG.glowBlur} ${COLORS_CONFIG[displayStatus].glow})` }}
          >
            {displayStatus === 'success' ? (
              <svg className="w-2/5 h-2/5 text-green-500" fill="none" stroke="currentColor" strokeWidth={LOADER_CONFIG.iconStrokeWidth} viewBox="0 0 24 24">
                <motion.path variants={pathVariants} initial="initial" animate="animate" exit="exit" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-2/5 h-2/5 text-red-500" fill="none" stroke="currentColor" strokeWidth={3.5} viewBox="0 0 24 24">
                <motion.path variants={pathVariants} initial="initial" animate="animate" exit="exit" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberLoader;