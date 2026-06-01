import React, { useState } from 'react';
import { tgAlerts, tgBiometrics, tgHaptics } from '../../../services/telegram';

const AdminDashboardView = () => {
  const [biometricStatus, setBiometricStatus] = useState('Не проверялось');
  const [bioType, setBioType] = useState('unknown');

  const testHaptic = (type, style) => {
    if (type === 'notification') {
      tgHaptics.notification(style);
    } else if (type === 'impact') {
      tgHaptics.impact(style);
    } else {
      tgHaptics.selection();
    }
  };

  const testBiometricsInit = async () => {
    const available = await tgBiometrics.init();
    if (available) {
      const type = tgBiometrics.getType();
      setBioType(type);
      setBiometricStatus(`Доступно (${type})`);
    } else {
      setBiometricStatus('Не поддерживается устройством');
    }
  };

  const testAuth = async () => {
    const success = await tgBiometrics.authenticate('Тестовый запрос панели администратора');
    if (success) {
      tgHaptics.notification('success');
      tgAlerts.showAlert('Успешная нативная аутентификация!');
    } else {
      tgHaptics.notification('error');
      tgAlerts.showAlert('Отказ в аутентификации или ошибка.');
    }
  };

  return (
    <div className="w-full h-full text-white flex flex-col gap-6 overflow-y-auto pb-12">
      <div className="border-b border-white/10 pb-2">
        <h2 className="text-xl font-bold text-purple-300">Инженерная панель WebApp</h2>
        <p className="text-xs opacity-60">Тестирование нативных интерфейсов устройства</p>
      </div>

      {/* Блок алертов */}
      <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-2xl border border-white/10">
        <h3 className="text-sm font-semibold mb-1 text-purple-200">1. Нативные уведомления</h3>
        <button
          onClick={() => tgAlerts.showAlert('Тестовое сообщение от админа')}
          className="w-full py-2.5 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/30 rounded-xl text-sm font-medium transition-all"
        >
          Вызвать showAlert
        </button>
        <button
          onClick={() => tgAlerts.showConfirm('Вы уверены?', (res) => tgAlerts.showAlert(`Ответ: ${res}`))}
          className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all mt-1"
        >
          Вызвать showConfirm
        </button>
      </div>

      {/* Блок вибрации */}
      <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-2xl border border-white/10">
        <h3 className="text-sm font-semibold mb-1 text-purple-200">2. Тактильная отдача (Haptics)</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => testHaptic('notification', 'success')}
            className="py-2 bg-emerald-600/30 border border-emerald-500/20 text-xs rounded-lg"
          >
            Success
          </button>
          <button
            onClick={() => testHaptic('notification', 'warning')}
            className="py-2 bg-amber-600/30 border border-amber-500/20 text-xs rounded-lg"
          >
            Warning
          </button>
          <button
            onClick={() => testHaptic('notification', 'error')}
            className="py-2 bg-rose-600/30 border border-rose-500/20 text-xs rounded-lg"
          >
            Error
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => testHaptic('impact', 'light')}
            className="py-2 bg-white/5 border border-white/10 text-xs rounded-lg"
          >
            Impact Light
          </button>
          <button
            onClick={() => testHaptic('impact', 'heavy')}
            className="py-2 bg-white/5 border border-white/10 text-xs rounded-lg"
          >
            Impact Heavy
          </button>
        </div>
        <button
          onClick={() => testHaptic('selection')}
          className="w-full py-2 bg-purple-500/20 border border-purple-500/30 text-xs rounded-lg mt-1"
        >
          Selection Changed (Табы)
        </button>
      </div>

      {/* Блок биометрии */}
      <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-2xl border border-white/10">
        <h3 className="text-sm font-semibold mb-1 text-purple-200">3. Биометрия (FaceID/TouchID)</h3>
        <div className="text-xs flex flex-col gap-1 opacity-80 mb-2">
          <div>Статус: <span className="font-mono text-purple-300">{biometricStatus}</span></div>
          <div>Тип датчика: <span className="font-mono text-purple-300">{bioType}</span></div>
        </div>
        <button
          onClick={testBiometricsInit}

          className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium transition-all"
        >
          Шаг 1: Инициализировать менеджер
        </button>
        <button
          onClick={testAuth}
          className="w-full py-2.5 bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/30 rounded-xl text-sm font-medium transition-all mt-1"
        >
          Шаг 2: Запросить отпечаток / лицо
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardView;