import React, { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { init, viewport } from '@tma.js/sdk-react';

import './index.css';
import AppLayout from "./pages/AppLayout.jsx";
import GroupInitLayout from "./pages/GroupInitLayout.jsx";
import VantaBackground from "./components/common/VantaBackground.jsx";
import { initApp } from '../services/initApp';
import { IS_DEV } from './config';
import useAppStore from './store/useAppStore.js';

// Настройка React Query клиента
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 минут данные считаются свежими
      gcTime: 1000 * 60 * 10,    // Кэш хранится 10 минут
    },
  },
});

const TelegramProvider = ({ children }) => {
  const didInit = useRef(false);

  useEffect(() => {
    // Предотвращаем двойную инициализацию из-за StrictMode в dev-режиме
    if (didInit.current) return;
    didInit.current = true;

    // 1. Запуск инициализации приложения — ПЕРЕДАЕМ queryClient, чтобы избежать краша с моками обменов
    initApp(queryClient);

    // 2. Инициализация Telegram SDK (только для продакшена)
    if (IS_DEV) {
      console.warn('[Telegram SDK] Приложение запущено в режиме разработки (DEV MODE). Интерфейсы Telegram проигнорированы.');
      return;
    }

    try {
      init();

      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.setHeaderColor('#1a1a1a');
        tg.setBackgroundColor('#1a1a1a');
      }

      if (viewport && typeof viewport.mount === 'function') {
        viewport.mount()
          .then(() => {
            viewport.expand();

            if (viewport.requestFullscreen && typeof viewport.requestFullscreen === 'function') {
              viewport.requestFullscreen().catch((err) => {
                console.warn('[Telegram SDK] Ошибка перехода в фулскрин:', err);
              });
            }

            viewport.bindCssVars();
          })
          .catch((err) => {
            console.error('[Telegram SDK] Ошибка при асинхронном монтировании viewport:', err);
          });
      } else {
        console.warn('[Telegram SDK] Компонент viewport не обнаружен в SDK');
      }
    } catch (e) {
      console.warn('[Telegram SDK] Не удалось инициализировать SDK, возможно запущено вне Telegram:', e);
    }
  }, []);

  return children;
};

const AppRoutes = () => {
  const needsGroupInit = useAppStore((state) => state.needsGroupInit);

  return (
    <Routes>
      <Route
        path="/"
        element={needsGroupInit ? <GroupInitLayout /> : <AppLayout />}
      />
    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <BrowserRouter>
          <VantaBackground />
          <AppRoutes />
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  </StrictMode>
);