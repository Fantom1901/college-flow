import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DutyCard from "./DutyCard.jsx";

const DutyStack = ({ items = [], isLoading }) => {
  const [stack, setStack] = useState(
    isLoading ? [{ id: 's1' }, { id: 's2' }, { id: 's3' }] : items
  );

  const [step, setStep] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    if (!isLoading && items && items.length > 0) {
      setStack(items);
    }
  }, [items, isLoading]);

  const rotateCards = (direction) => {
    if (isLoading || stack.length < 2) return;

    setStack((prev) => {
      const newItems = [...prev];
      if (direction === 'next') {
        const first = newItems.shift();
        newItems.push(first);
      } else {
        const last = newItems.pop();
        newItems.unshift(last);
      }
      return newItems;
    });

    setStep((prev) => {
      const itemsCount = stack.length || 3;
      if (direction === 'next') return (prev + 1) % itemsCount;
      return (prev - 1 + itemsCount) % itemsCount;
    });
    setIsPulling(false);
  };

  return (
    <div className="relative w-full h-[160px] flex justify-center items-center">
      <AnimatePresence mode="popLayout">
        {stack.map((item, index) => {
          // Индексы для позиционирования (только первые 3 видимы)
          const isFront = index === 0;
          const isMiddle = index === 1;
          const isBack = index === 2;

          // Ограничиваем рендер только тремя карточками для производительности
          if (index > 2) return null;

          const config = {
            zIndex: isFront ? 3 : isMiddle ? 2 : 1,
            width: isFront ? '228px' : isMiddle ? '212px' : '196px',
            y: isFront ? 0 : isMiddle ? 15 : -10,
            scale: isBack && !isPulling ? 0.95 : 1,
            opacity: isBack && !isPulling ? 0.6 : 1
          };

          return (
            <motion.div
              key={item.id || index}
              layout
              drag={isFront && !isLoading ? "y" : false}
              dragSnapToOrigin={true}
              dragConstraints={{ top: -40, bottom: 40 }}
              dragElastic={0.05}
              onDrag={(_, info) => {
                if (isFront && !isLoading) {
                  if (Math.abs(info.offset.y) > 5) {
                    if (!isPulling) setIsPulling(true);
                  } else {
                    if (isPulling) setIsPulling(false);
                  }
                }
              }}
              onDragEnd={(_, info) => {
                if (isFront && !isLoading) {
                  if (info.offset.y > 60) {
                    rotateCards('next');
                  } else if (info.offset.y < -60) {
                    rotateCards('prev');
                  } else {
                    setIsPulling(false);
                  }
                }
              }}
              animate={{
                ...config,
                y: isFront ? 0 : config.y
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 70
              }}
              className="absolute cursor-grab active:cursor-grabbing"
            >
              <DutyCard
                isLoading={isLoading} // Передаем статус загрузки
                isActive={isFront || ((isMiddle || isBack) && isPulling)}
                isPulling={isPulling}
                width={config.width}
                zIndex={config.zIndex}
                activeIndex={isFront ? step : isMiddle ? (step + 1) % 3 : (step - 1 + 3) % 3}
                data={item} // Если тут придет пустой объект, деструктуризация внутри DutyCard сработает
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DutyStack;