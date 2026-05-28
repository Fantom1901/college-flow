import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExchangeStore, useExchangeData, useUpdateExchangeStatus } from '../../store/useExchange.js';
import { ExchangeTabs } from '../exchange/ExchangeTabs.jsx';
import { ExchangeCard } from '../exchange/ExchangeCard.jsx';
import { ExchangeActions } from '../exchange/ExchangeActions.jsx';
import { EmptyState } from '../exchange/EmptyState.jsx';

export const ExchangeView = () => {
  const { activeTab, setActiveTab } = useExchangeStore();
  const { data, isLoading, isError } = useExchangeData();
  const { mutate: updateStatus, isPending: isMutating } = useUpdateExchangeStatus();

  const handleUpdateStatus = (exchangeId, status) => {
    updateStatus({ exchangeId, status });
  };

  const currentRequests = data ? data[activeTab] : [];

  return (
    <div className="fixed inset-0 flex flex-col w-full h-full overflow-hidden bg-transparent select-none">

      {/* Шапка (фиксированная высота) */}
      <div className="flex flex-col gap-5 px-4 pt-4 pb-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="font-black text-[22px] uppercase italic tracking-wider text-white">
            Обмен дежурствами
          </h1>
          <p className="text-[11px] font-extrabold uppercase italic tracking-wide text-slate-400">
            Управление заявками вашей группы
          </p>
        </div>
        <ExchangeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Контейнер карточек (скроллится отдельно) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" className="w-full py-12 flex justify-center items-center">
              <span className="font-extrabold text-[12px] uppercase italic tracking-widest text-slate-400 animate-pulse">
                Синхронизация заявок...
              </span>
            </motion.div>
          ) : isError ? (
            <motion.div key="error" className="w-full py-12 flex justify-center items-center">
              <span className="font-extrabold text-[12px] uppercase italic tracking-widest text-accent-red">
                Не удалось загрузить данные
              </span>
            </motion.div>
          ) : currentRequests.length > 0 ? (
            <motion.div key="list" className="flex flex-col gap-4">
              {currentRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className="relative z-10"
                >
                  <ExchangeCard request={request} activeTab={activeTab}>
                    <ExchangeActions
                      exchangeId={request.id}
                      activeTab={activeTab}
                      status={request.status}
                      onUpdateStatus={handleUpdateStatus}
                      isLoading={isMutating}
                    />
                  </ExchangeCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState activeTab={activeTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Докбар теперь зафиксирован внизу главного контейнера, а не внутри скролла */}
    </div>
  );
};

export default ExchangeView;