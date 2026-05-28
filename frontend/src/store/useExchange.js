import { create } from 'zustand'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { exchangeApi } from '../api/exchange.js'
import { IS_DEV, MOCK_EXCHANGE } from '../config.js'

// 1. Маленький Zustand-стор для сохранения активной вкладки при навигации
export const useExchangeStore = create((set) => ({
  activeTab: 'incoming', // 'incoming' | 'outgoing' | 'history'
  setActiveTab: (tab) => set({ activeTab: tab }),
}))

// 2. React Query хук для получения всех списков обмена (с поддержкой Dev Mode)
export const useExchangeData = () => {
  return useQuery({
    queryKey: ['exchangeRequests'],
    queryFn: () => {
      if (IS_DEV) {
        // В дев-моде мгновенно отдаем моки из конфига
        return Promise.resolve(MOCK_EXCHANGE)
      }
      // В продакшене идем по сети на бэк
      return exchangeApi.getRequests()
    },
    select: (data) => ({
      incoming: data?.incoming || [],
      outgoing: data?.outgoing || [],
      history: data?.history || [],
    }),
    staleTime: IS_DEV ? Infinity : 1000 * 30, // В дев-моде кэш не устаревает автоматически
  })
}

// 3. React Query мутация для изменения статуса (с симуляцией задержки сети для Dev Mode)
export const useUpdateExchangeStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ exchangeId, status }) => {
      if (IS_DEV) {
        // Имитируем пинг сети в 600мс, чтобы покрутить лоадер на кнопках
        return new Promise((resolve) => setTimeout(resolve, 600))
      }
      return exchangeApi.updateStatus(exchangeId, status)
    },
    onSuccess: (data, variables) => {
      if (IS_DEV) {
        // Локально обновляем кэш в дев-моде, чтобы карточка перенеслась в историю/исчезла
        queryClient.setQueryData(['exchangeRequests'], (oldData) => {
          if (!oldData) return oldData

          let foundRequest = null
          const nextData = {
            incoming: oldData.incoming.filter(r => {
              if (r.id === variables.exchangeId) { foundRequest = { ...r, status: variables.status }; return false }
              return true
            }),
            outgoing: oldData.outgoing.filter(r => {
              if (r.id === variables.exchangeId) { foundRequest = { ...r, status: variables.status }; return false }
              return true
            }),
            history: [...oldData.history]
          }

          if (foundRequest) {
            nextData.history.unshift(foundRequest)
          }

          return nextData
        })
      } else {
        // В продакшене просто триггерим полный перезапрос данных с бэка
        queryClient.invalidateQueries({ queryKey: ['exchangeRequests'] })
      }
    },
  })
}