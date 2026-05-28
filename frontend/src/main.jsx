import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { init, viewport, settingsButton, mainButton, backButton } from '@telegram-apps/sdk-react';

import './index.css';
import AppLayout from "./pages/AppLayout.jsx";
import { BackgroundImage } from './components/BackgroundImage.jsx';
import VantaBackground from "./components/VantaBackground.jsx";
import Dockbar from './components/Dockbar.jsx';

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

  // Твой код с viewport (оставляем для совместимости)
  if (viewport.mount.isAvailable()) {
    viewport.mount().then(() => {
      if (viewport.expand.isAvailable()) viewport.expand();
    });
  }
} catch (e) {
  console.warn('Запущено вне Telegram');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Вот это решает проблему: 5 минут данные не будут дёргать бэк при переключении вкладок
      staleTime: 1000 * 60 * 5,
      // Время жизни кэша в памяти (сделай чуть больше, например 10 минут)
      gcTime: 1000 * 60 * 10,
    },
  },
});

const TelegramProvider = ({ children }) => {
  useEffect(() => {
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
            {/*<Dockbar />*/}
          </div>
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  </StrictMode>
);