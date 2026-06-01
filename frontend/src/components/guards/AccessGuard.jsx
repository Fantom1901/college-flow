import React from 'react';
import useAppStore from '../../store/useAppStore.js';

/**
 * Компонент для разграничения прав доступа к элементам интерфейса и экранам.
 *
 * @param {string[]} allowedRoles - Массив ролей, которым разрешен доступ (например, ['leader', 'curator'])
 * @param {React.ReactNode} children - Контент, который отрендерится при успешной проверке
 * @param {React.ReactNode} [fallback=null] - Компонент-заглушка, если доступ запрещен
 */
const AccessGuard = ({ allowedRoles, children, fallback = null }) => {
  const hasRole = useAppStore((state) => state.hasRole);

  // Проверяем, входит ли роль текущего юзера в список разрешенных
  const isAllowed = hasRole(allowedRoles);

  if (!isAllowed) {
    return fallback;
  }

  return <>{children}</>;
};

export default AccessGuard;