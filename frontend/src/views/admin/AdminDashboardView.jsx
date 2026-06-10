import React, { useState } from 'react';
import { tgAlerts, tgBiometrics, tgHaptics } from '../../../services/telegram';
// Импортируем наш API инвайтов
import { inviteApi } from '../../api/invite.js'; // Скорректируй путь к файлу, если нужно

const AdminDashboardView = () => {
  const [biometricStatus, setBiometricStatus] = useState('Не проверялось');
  const [bioType, setBioType] = useState('unknown');

  // Состояния для инвайта куратора
  const [curatorLink, setCuratorLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Метод генерации ссылки для куратора
  const generateCuratorLink = async () => {
    setIsGenerating(true);
    try {
      tgHaptics.impact('light');
      const data = await inviteApi.createCuratorLink();

      // Согласно схеме CuratorInviteResponse возвращается объект { link: "string" }
      if (data && data.link) {
        setCuratorLink(data.link);
        tgHaptics.notification('success');
      } else {
        throw new Error('Ссылка отсутствует в ответе сервера');
      }
    } catch (error) {
      console.error(error);
      tgHaptics.notification('error');
      tgAlerts.showAlert('Не удалось сгенерировать ссылку для куратора.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Хелпер для быстрого копирования инвайта
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        tgHaptics.notification('success');
        tgAlerts.showAlert('Ссылка скопирована в буфер обмена!');
      })
      .catch(() => {
        tgAlerts.showAlert(`Скопируйте вручную: ${text}`);
      });
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

      {/* Блок приглашений (Новый) */}
      <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-2xl border border-white/10">
        <h3 className="text-sm font-semibold mb-1 text-purple-200">4. Управление инвайтами</h3>
        <button
          onClick={generateCuratorLink}
          disabled={isGenerating}
          className="w-full py-2.5 bg-fuchsia-600/40 hover:bg-fuchsia-600/60 border border-fuchsia-500/30 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Генерация...' : 'Создать ссылку для куратора'}
        </button>

        {curatorLink && (
          <div
            onClick={() => copyToClipboard(curatorLink)}
            className="mt-2 p-3 bg-fuchsia-950/40 border border-fuchsia-500/20 rounded-xl cursor-pointer hover:bg-fuchsia-950/60 transition-all flex flex-col gap-1 group"
          >
            <span className="text-[10px] uppercase tracking-wider text-fuchsia-400 font-semibold">Ссылка создана (Нажмите, чтобы скопировать):</span>
            <span className="text-xs font-mono break-all text-white/90 group-hover:text-white">
              {curatorLink}
            </span>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboardView;