import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExchangeStore, useExchangeData, useUpdateExchangeStatus } from '../../store/useExchange.js';
import { ExchangeTabs } from '../exchange/ExchangeTabs.jsx';
import { ExchangeCard } from '../exchange/ExchangeCard.jsx';
import { ExchangeActions } from '../exchange/ExchangeActions.jsx';
import { EmptyState } from '../exchange/EmptyState.jsx';

export const ExchangeView = () => {
  // 1. Получаем состояние активного таба из Zustand-стора
  const { activeTab, setActiveTab } = useExchangeStore();

  // 2. Стягиваем массивы заявок из React Query
  const { data, isLoading, isError } = useExchangeData();

  // 3. Забираем мутацию для изменения статуса обмена
  const { mutate: updateStatus, isPending: isMutating } = useUpdateExchangeStatus();

  // Хэндлер для отправки экшена на бэк
  const handleUpdateStatus = (exchangeId, status) => {
    updateStatus({ exchangeId, status });
  };

  // Выбираем нужный массив данных на основе активной вкладки
  const currentRequests = data ? data[activeTab] : [];

  return (
    <div className="w-full h-full flex flex-col gap-5 px-4 pt-4 pb-24 overflow-hidden select-none">

      {/* Шапка экрана в твоем стиле */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="font-black text-[22px] uppercase italic tracking-wider text-white">
          Обмен дежурствами
        </h1>
        <p className="text-[11px] font-extrabold uppercase italic tracking-wide text-slate-400">
          Управление заявками вашей группы
        </p>
      </div>

      {/* Деталька 1: Стеклянный переключатель вкладок */}
      <div className="shrink-0">
        <ExchangeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Зона контента со скрытым скроллом под мобилки */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-transparent bg-none border-none isolate-none">

        {/* Состояние загрузки данных */}
        {isLoading && (
          <div className="w-full py-12 flex justify-center items-center">
            <span className="font-extrabold text-[12px] uppercase italic tracking-widest text-slate-400 animate-pulse">
              Синхронизация заявок...
            </span>
          </div>
        )}

        {/* Состояние ошибки API */}
        {isError && (
          <div className="w-full py-12 flex justify-center items-center text-center">
            <span className="font-extrabold text-[12px] uppercase italic tracking-widest text-accent-red">
              Не удалось загрузить данные
            </span>
          </div>
        )}

        {/* Отрендеренные списки с анимациями появления */}
        {!isLoading && !isError && (
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {currentRequests.length > 0 ? (
                currentRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    layout
                    className="bg-transparent bg-none border-none shadow-none outline-none"
                  >
                    {/* Деталька 2: Универсальная карточка */}
                    <ExchangeCard request={request} activeTab={activeTab}>
                      {/* Деталька 3: Интерактивные кнопки действий внутри карточки */}
                      <ExchangeActions
                        exchangeId={request.id}
                        activeTab={activeTab}
                        status={request.status}
                        onUpdateStatus={handleUpdateStatus}
                        isLoading={isMutating}
                      />
                    </ExchangeCard>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Деталька 4: Заглушка, если пусто */}
                  <EmptyState activeTab={activeTab} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
};

export default ExchangeView;