import React, { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { init, viewport } from '@telegram-apps/sdk-react';

import './index.css';
import AppLayout from "./pages/AppLayout.jsx";
import VantaBackground from "./components/common/VantaBackground.jsx";
import { initApp } from '../services/initApp';
import { IS_DEV } from './config';

// 1. Безопасная инициализация Telegram SDK на глобальном уровне
if (IS_DEV) {
  console.warn('[Telegram SDK] Приложение запущено в режиме разработки (DEV MODE). Интерфейсы Telegram проигнорированы.');
} else {
  try {
    init();

    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      if (tg.isVersionAtLeast('7.0')) {
        tg.requestFullscreen();
      }

      tg.setHeaderColor('#1a1a1a');
      tg.setBackgroundColor('#1a1a1a');
    }

    if (viewport.mount.isAvailable()) {
      viewport.mount().then(() => {
        if (viewport.expand.isAvailable()) viewport.expand();
      });
    }
  } catch (e) {
    console.warn('[Telegram SDK] Не удалось инициализировать SDK, возможно запущено вне Telegram:', e);
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

const TelegramProvider = ({ children }) => {
  const didInit = useRef(false);

  useEffect(() => {
    // Вызываем initApp строго один раз, предотвращая кашу из-за StrictMode
    if (!didInit.current) {
      initApp();
      didInit.current = true;
    }

    // В DEV-режиме полностью скипаем настройку визуализации WebApp
    if (IS_DEV) return;

    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const timer = setTimeout(() => {
        if (tg.isVersionAtLeast('7.0')) {
          try {
            tg.requestFullscreen();
          } catch (e) {
            console.error("Fullscreen failed:", e);
          }
        }
        tg.setHeaderColor('#1a1a1a');
      }, 150);

      return () => clearTimeout(timer);
    }
  }, []);

  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <BrowserRouter>
          <VantaBackground />
          <div style={{ paddingTop: 'var(--tg-safe-area-inset-top, 0px)' }}>
            <Routes>
              <Route path="/" element={<AppLayout />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  </StrictMode>
);