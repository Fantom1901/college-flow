import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';
import VantaBackground from "./components/common/VantaBackground.jsx";
import TelegramProvider from './providers/TelegramProvider.jsx';
import RoleRouter from './layouts/RoleRouter.jsx';
import GroupInitLayout from "./layouts/GroupInitLayout.jsx";
import useAppStore from './store/useAppStore.js';

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

const AppRoutes = () => {
  const needsGroupInit = useAppStore((state) => state.needsGroupInit);

  return (
    <Routes>
      <Route
        path="/"
        element={needsGroupInit ? <GroupInitLayout /> : <RoleRouter />}
      />
    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TelegramProvider queryClient={queryClient}>
        <BrowserRouter>
          <VantaBackground />
          <AppRoutes />
        </BrowserRouter>
      </TelegramProvider>
    </QueryClientProvider>
  </StrictMode>
);