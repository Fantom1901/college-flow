import React from 'react';
import useAppStore from "../../store/useAppStore.js";
import AppLoader from "./AppLoader.jsx";
import AppError from "./AppError.jsx";

const AppInitializer = ({ children }) => {
    const serverStatus = useAppStore((state) => state.serverStatus);

    // Если приложение ещё грузится или ушло в оффлайн на старте
    if (serverStatus === 'loading' || serverStatus === 'offline') {
        return <AppLoader />;
    }

    // Если бэк лежит или вернул критическую ошибку при initApp
    if (serverStatus === 'error') {
        return <AppError />;
    }

    // Если всё отлично (online), рендерим основное приложение
    return <>{children}</>;
};

export default AppInitializer;