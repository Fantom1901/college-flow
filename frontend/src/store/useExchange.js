import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exchangeApi } from '../api/exchange.js';
import { IS_DEV, MOCK_EXCHANGE } from '../config.js';

/**
 * useExchangeStore - Локальный UI-стейт для сохранения активной вкладки обменов.
 */
export const useExchangeStore = create((set) => ({
  activeTab: 'incoming', // Допустимые вкладки: 'incoming' | 'outgoing' | 'history'
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

/**
 * useExchangeData - Хук React Query для безопасного получения списков обмена дежурствами.
 * Автоматически подменяет ответ на MOCK_EXCHANGE, если активен дев-режим.
 */
export const useExchangeData = () => {
  return useQuery({
    queryKey: ['exchangeRequests'],
    queryFn: () => {
      if (IS_DEV) {
        return Promise.resolve(MOCK_EXCHANGE);
      }
      return exchangeApi.getRequests();
    },
    select: (data) => ({
      incoming: data?.incoming || [],
      outgoing: data?.outgoing || [],
      history: data?.history || [],
    }),
    staleTime: IS_DEV ? Infinity : 1000 * 30,
  });
};

/**
 * useUpdateExchangeStatus - Мутация обработки заявок (аппрув / отмена / режект).
 * В дев-режиме вручную пересобирает кэш квери-клиента для моментального апдейта интерфейса.
 */
export const useUpdateExchangeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exchangeId, status }) => {
      if (IS_DEV) {
        return new Promise((resolve) => setTimeout(resolve, 600)); // Симуляция пинга сети
      }
      return exchangeApi.updateStatus(exchangeId, status);
    },
    onSuccess: (data, variables) => {
      if (IS_DEV) {
        // Оптимистичное обновление кэша для тестирования перетаскивания карточек в UI
        queryClient.setQueryData(['exchangeRequests'], (oldData) => {
          if (!oldData) return oldData;
          let foundRequest = null;

          const nextData = {
            incoming: oldData.incoming.filter(r => {
              if (r.id === variables.exchangeId) { foundRequest = { ...r, status: variables.status }; return false; }
              return true;
            }),
            outgoing: oldData.outgoing.filter(r => {
              if (r.id === variables.exchangeId) { foundRequest = { ...r, status: variables.status }; return false; }
              return true;
            }),
            history: [...oldData.history]
          };

          if (foundRequest) {
            nextData.history.unshift(foundRequest);
          }
          return nextData;
        });
      } else {
        // На проде сбрасываем кэш и тянем свежак с FastAPI
        queryClient.invalidateQueries({ queryKey: ['exchangeRequests'] });
      }
    },
  });
};