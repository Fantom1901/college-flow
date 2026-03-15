import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { init, viewport, settingsButton, mainButton, backButton } from '@telegram-apps/sdk-react';

import './index.css';
import AppLayout from "./pages/AppLayout.jsx";
import { BackgroundImage } from './components/BackgroundImage.jsx';
import Dockbar from './components/Dockbar.jsx';

try {
  init();

  if (viewport.mount.isAvailable()) {
    viewport.mount().then(() => {
      // 1. Раскрываем на максимум
      if (viewport.expand.isAvailable()) viewport.expand();

      // 2. ВКЛЮЧАЕМ ПОЛНОЭКРАННЫЙ РЕЖИМ (Fullscreen)
      // Это уберет статичную полосу и сделает кнопки плавающими
      if (viewport.requestFullscreen.isAvailable()) {
        viewport.requestFullscreen();
      }
    }).catch(err => console.error("Viewport mount error:", err));
  }
} catch (e) {
  console.warn('Запущено вне Telegram или ошибка SDK');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const TelegramProvider = ({ children }) => {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.setHeaderColor('#1a1a1a');
      tg.setBackgroundColor('#1a1a1a');
    }
  }, []);

  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <BrowserRouter>
          <BackgroundImage />
          <div style={{ paddingTop: 'var(--tg-safe-area-inset-top, 0px)' }}>
            <Routes>
              <Route path="/" element={<AppLayout />} />
            </Routes>
            <Dockbar />
          </div>
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  </StrictMode>
);