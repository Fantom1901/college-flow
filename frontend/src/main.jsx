import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { init, viewport } from '@telegram-apps/sdk-react';

import './index.css';
import AppLayout from "./pages/AppLayout.jsx";
import { BackgroundImage } from './components/BackgroundImage.jsx';
import Dockbar from './components/Dockbar.jsx';

// Инициализация Telegram SDK
try {
  init();
  // Попытка примонтировать viewport, если это возможно
  if (viewport.mount.isAvailable()) {
    viewport.mount().then(() => {
      if (viewport.expand.isAvailable()) viewport.expand();
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BackgroundImage />
        <div>
          <Routes>
            <Route path="/" element={<AppLayout />} />
          </Routes>
          <Dockbar />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);