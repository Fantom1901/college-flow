import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DutyCard from "./DutyCard.jsx";

const DutyStack = ({ initialItems }) => {
  const [items, setItems] = useState(initialItems || []);
  const [step, setStep] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const rotateCards = (direction) => {
    setItems((prev) => {
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
      if (direction === 'next') return (prev + 1) % 3;
      return (prev - 1 + 3) % 3;
    });
    setIsPulling(false);
  };

  return (
    <div className="relative w-full h-[160px] flex justify-center items-center">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => {
          const isFront = index === 0;
          const isMiddle = index === 1;
          const isBack = index === 2;

          const config = {
            zIndex: isFront ? 3 : isMiddle ? 2 : 1,
            width: isFront ? '228px' : isMiddle ? '212px' : '196px',
            y: isFront ? 0 : isMiddle ? 15 : -10,
            scale: 1,
            opacity: 1
          };

          return (
            <motion.div
              key={item.id}
              layout
              drag={isFront ? "y" : false}
              dragSnapToOrigin={true}
              dragConstraints={{ top: -40, bottom: 40 }}
              dragElastic={0.05}
              onDrag={(_, info) => {
                if (isFront) {
                  // Используем Math.abs для работы в обе стороны
                  if (Math.abs(info.offset.y) > 5) {
                    if (!isPulling) setIsPulling(true);
                  } else {
                    if (isPulling) setIsPulling(false);
                  }
                }
              }}
              onDragEnd={(_, info) => {
                if (isFront) {
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
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 70
              }}
              className="absolute cursor-grab active:cursor-grabbing"
            >
              <DutyCard
                isActive={isFront || ((isMiddle || isBack) && isPulling)}
                width={config.width}
                zIndex={config.zIndex}
                activeIndex={isFront ? step : isMiddle ? (step + 1) % 3 : (step - 1 + 3) % 3}
                data={item} // ВОТ ТУТ мы передаем данные конкретной карточки
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DutyStack;