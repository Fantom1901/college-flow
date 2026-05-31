import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../store/useAppStore';
import GroupInitForm from './settings/GroupInitForm'; // Твоя будущая форма из Шага 4

/**
 * Изолированный компонент-перехватчик для инициализации группы куратора.
 * Оборачивает только те части интерфейса, которые требуют созданной группы.
 */
const GroupInitGuard = ({ children }) => {
  const needsGroupInit = useAppStore((state) => state.needsGroupInit);

  return (
    <AnimatePresence mode="wait">
      {needsGroupInit ? (
        <motion.div
          key="init-screen"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full px-4 pt-4"
        >
          <GroupInitForm />
        </motion.div>
      ) : (
        <motion.div
          key="content-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GroupInitGuard;