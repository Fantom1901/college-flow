import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../cards/GlassCard.jsx';
import { tgHaptics } from "../../../../services/telegram/index.js";

/**
 * @file CyberStepper.jsx
 * @description Вертикальная импульсная шкала прогресса с мгновенным стартом анимации на каждом шаге.
 */

const CyberStepper = ({
                        stepsCount,
                        currentStep,
                        totalTicks = 30,
                        className = "",
                        as: Container = GlassCard
                      }) => {

  const [isFinished, setIsFinished] = useState(false);

  // Храним предыдущий целевой индекс, чтобы знать, откуда стартует новый импульс
  const prevTargetIndexRef = useRef(0);

  useEffect(() => {
    if (currentStep < stepsCount - 1) {
      setIsFinished(false);
    }
  }, [currentStep, stepsCount]);

  const checkpointIndices = useMemo(() => {
    const indices = [];
    if (stepsCount <= 1) return [0];

    const stepInterval = (totalTicks - 1) / (stepsCount - 1);
    for (let i = 0; i < stepsCount; i++) {
      indices.push(Math.round(i * stepInterval));
    }
    return indices;
  }, [stepsCount, totalTicks]);

  const targetTickIndex = useMemo(() => {
    if (stepsCount <= 1) return totalTicks - 1;
    const stepInterval = (totalTicks - 1) / (stepsCount - 1);
    return Math.round(currentStep * stepInterval);
  }, [currentStep, stepsCount, totalTicks]);

  const staggerDuration = useMemo(() => {
    if (stepsCount <= 1) return 0.005;
    const ticksPerStep = (totalTicks - 1) / (stepsCount - 1);
    return 0.18 / ticksPerStep; // Чуть-чуть поджали общую скорость пролёта
  }, [stepsCount, totalTicks]);

  const handleTickAnimationComplete = (isCheckpoint, isFilled, isFinalCheckpoint) => {
    if (!isFilled) return;

    if (isCheckpoint) {
      if (isFinalCheckpoint) {
        setTimeout(() => {
          setIsFinished(true);
          tgHaptics.notification('success');
        }, 180);
      } else if (!isFinished) {
        tgHaptics.selection();
      }
    }
  };

  // После каждого рендера запоминаем текущий индекс как старый для следующего шага
  useEffect(() => {
    prevTargetIndexRef.current = targetTickIndex;
  }, [targetTickIndex]);

  return (
    <Container className={`w-full flex items-center justify-between h-8 px-3 py-2 transition-all duration-500 ${className}`}>
      {Array.from({ length: totalTicks }).map((_, index) => {
        const isCheckpoint = checkpointIndices.includes(index);
        const isFilled = index <= targetTickIndex;
        const isFinalCheckpoint = index === checkpointIndices[checkpointIndices.length - 1];

        const widthClass = isCheckpoint ? 'w-[6px] h-full' : 'w-[4px] h-3/5';
        const activeColorClass = isFinished ? 'bg-accent-green' : 'bg-accent-purple';

        const shadowStyle = isCheckpoint
          ? { filter: isFinished ? 'drop-shadow(0 0 8px rgba(52,211,153,0.8))' : 'drop-shadow(0 0 8px rgba(191,90,242,0.8))' }
          : {};

        // МАГИЯ ТУТ: Вычисляем задержку относительно ПРЕДЫДУЩЕГО чекпоинта
        // Если индекс полоски меньше, чем то, что уже горело — задержка 0.
        // Для новых полосок задержка пойдет с нуля: 0 * stagger, 1 * stagger, 2 * stagger...
        const relativeIndex = index - prevTargetIndexRef.current;
        const currentDelay = isFilled && relativeIndex > 0 ? relativeIndex * staggerDuration : 0;

        return (
          <div
            key={index}
            className={`${widthClass} relative rounded-full bg-slate-700/60 transition-colors duration-500`}
          >
            <motion.div
              className={`absolute inset-0 rounded-full ${activeColorClass} transition-colors duration-500`}
              style={shadowStyle}
              initial={false}
              animate={{ opacity: isFilled ? 1 : 0 }}
              onAnimationComplete={() => handleTickAnimationComplete(isCheckpoint, isFilled, isFinalCheckpoint)}
              transition={{
                type: 'tween',
                ease: 'easeInOut',
                delay: currentDelay, // Применяем мгновенную относительную задержку
                duration: 0.08 // Сделали проявление самой полоски ещё капельку резвее
              }}
            />
          </div>
        );
      })}
    </Container>
  );
};

export default CyberStepper;