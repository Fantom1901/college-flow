import React, { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { init, viewport } from '@tma.js/sdk-react';

import './index.css';
import AppLayout from "./pages/AppLayout.jsx";
import VantaBackground from "./components/common/VantaBackground.jsx";
import { initApp } from '../services/initApp';
import { IS_DEV } from './config';

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

    // 1. Запуск инициализации приложения (стейты, моки или запросы к бэку)
    initApp();

    // 2. Инициализация Telegram SDK (только для продакшена)
    if (IS_DEV) {
      console.warn('[Telegram SDK] Приложение запущено в режиме разработки (DEV MODE). Интерфейсы Telegram проигнорированы.');
      return;
    }

    try {
      // Инициализируем жизненный цикл SDK v3 синхронно
      init();

      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.setHeaderColor('#1a1a1a');
        tg.setBackgroundColor('#1a1a1a');
      }

      // Безопасно монтируем viewport по новой доке v3
      if (viewport && typeof viewport.mount === 'function') {
        viewport.mount()
          .then(() => {
            // Принудительно расширяем вьюпорт
            viewport.expand();

            // Безопасно проверяем флскрин
            if (viewport.requestFullscreen && typeof viewport.requestFullscreen === 'function') {
              viewport.requestFullscreen().catch((err) => {
                console.warn('[Telegram SDK] Ошибка перехода в фулскрин:', err);
              });
            }

            // Биндим CSS-переменные в DOM
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <BrowserRouter>
          {/* Анимированный фоновый компонент */}
          <VantaBackground />

          <Routes>
            <Route path="/" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  </StrictMode>
);