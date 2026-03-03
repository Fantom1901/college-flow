import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import './index.css';
import HomePage from "./pages/HomePage.jsx";
import {BackgroundImage} from './components/BackgroundImage.jsx';
import Dockbar from './components/Dockbar.jsx';

import {init, viewport} from '@telegram-apps/sdk-react';

try {
  init();
  viewport.mount().then(() => {
    viewport.expand();
  });
} catch (e) {
  console.log('Запущено вне Telegram или ошибка SDK');
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BackgroundImage/>

        <Routes>
          <Route path="/" element={<HomePage/>}/>
        </Routes>

        <Dockbar/>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);