import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import TelegramSafeProvider from '../providers/TelegramSafeProvider.jsx';
import AppInitializer from "../components/status/AppInitializer.jsx";
import { GroupInitForm } from "../components/features/settings/GroupInitForm.jsx";

// Твои UI компоненты
import GlassCard from '../components/ui/cards/GlassCard.jsx';
import Typography from '../components/ui/typography/Typography.jsx';
import PrimaryButton from '../components/ui/buttons/PrimaryButton.jsx';
import CyberStepper from '../components/ui/feedback/CyberStepper.jsx';

import useAppStore from '../store/useAppStore.js';
import useGroupStore from '../store/useGroupStore.js';
import { groupsApi } from '../api/groups.js'; // Убедись, что тут есть bulkCreate
import { tgHaptics } from "../../services/telegram/index.js";
import { simulateGroupInitialization } from '../../services/initApp.js';

const GroupInitLayout = () => {
  const queryClient = useQueryClient();
  const user = useAppStore((state) => state.user);
  const setNeedsGroupInit = useAppStore((state) => state.setNeedsGroupInit);

  // Управление шагами локального интерфейса
  const [currentStep, setCurrentStep] = useState(0); // 0: Куратор, 1: Студенты, 2: Ссылки
  const [errorText, setErrorText] = useState('');

  // Локальные стейты для второго шага (студенты)
  const [studentNames, setStudentNames] = useState('');
  const [generatedLinks, setGeneratedLinks] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Храним ID созданной группы между шагами
  const [createdGroupId, setCreatedGroupId] = useState(null);

  const isSuccessfullyDispatched = useRef(false);

  // МУТАЦИЯ 1: Инициализация группы куратором
  const initGroupMutation = useMutation({
    mutationFn: async (fullPayload) => {
      if (import.meta.env.DEV) {
        return simulateGroupInitialization(fullPayload, queryClient);
      }
      return groupsApi.initGroup(fullPayload);
    },
    onSuccess: (data, variables) => {
      if (tgHaptics?.notification) tgHaptics.notification('success');

      setCreatedGroupId(data.group_id);

      if (!import.meta.env.DEV) {
        const { setGroup } = useGroupStore.getState();
        const { setUser } = useAppStore.getState();

        setGroup({
          id: data.group_id,
          name: data.group_name,
          students: []
        });

        setUser({
          ...user,
          curator_profile: {
            id: data.group_id,
            full_name: variables.full_name,
            group_id: data.group_id
          }
        });
      }

      // Вместо закрытия лейаута — просто двигаем степпер вперед
      setCurrentStep(1);
    },
    onError: (err) => {
      if (tgHaptics?.notification) tgHaptics.notification('error');
      console.error('[GroupInit] Ошибка:', err?.response?.data || err);
      let backendMessage = err?.response?.data?.detail;
      if (Array.isArray(backendMessage)) {
        backendMessage = backendMessage.map(e => `${e.loc.join('.')}: ${e.msg}`).join(' | ');
      }
      setErrorText(backendMessage || 'Ошибка создания группы. Проверь данные.');
    }
  });

  // МУТАЦИЯ 2: Массовое создание студентов
  const bulkCreateMutation = useMutation({
    mutationFn: async ({ groupId, names }) => {
      if (import.meta.env.DEV) {
        return names.map((name, i) => ({ name, link: `https://t.me/bot?start=std_${groupId}_${i}` }));
      }
      // Передаем в API правильное имя поля: group_id
      return groupsApi.bulkCreate(groupId, names);
    },
    onSuccess: (data) => {
      if (tgHaptics?.notification) tgHaptics.notification('success');
      setGeneratedLinks(data);
      setCurrentStep(2);
    },
    onError: (err) => {
      if (tgHaptics?.notification) tgHaptics.notification('error');
      console.error('[BulkCreate] Error:', err?.response?.data || err);
      setErrorText(err?.response?.data?.detail || 'Ошибка при генерации ссылок.');
    }
  });

  // Хэндлер отправки первого шага (Форма куратора)
  const handleFormSubmit = (formData) => {
    if (initGroupMutation.isPending || currentStep !== 0) return;
    setErrorText('');

    const inviteCode =
      window.Telegram?.WebApp?.initDataUnsafe?.start_param ||
      new URLSearchParams(window.location.search).get('tgWebAppStartParam') ||
      'default_curator_code';

    const rawTgId = user?.tg_id || window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const cleanTgId = rawTgId ? parseInt(rawTgId, 10) : null;

    if (!cleanTgId || isNaN(cleanTgId)) {
      setErrorText('Критическая ошибка: Не удалось определить ваш Telegram ID.');
      return;
    }

    const fullPayload = {
      invite_code: String(inviteCode).trim(),
      full_name: String(formData.fullName).trim(),
      group_name: String(formData.groupName).trim(),
      tg_id: cleanTgId,
      username: user?.username || window.Telegram?.WebApp?.initDataUnsafe?.user?.username || null
    };

    initGroupMutation.mutate(fullPayload);
  };

  // Хэндлер отправки второго шага (Список студентов)
  // Хэндлер отправки второго шага (Список студентов)
// Хэндлер отправки второго шага (Список студентов)
  const handleStudentsSubmit = () => {
    if (bulkCreateMutation.isPending || currentStep !== 1) return;
    setErrorText('');

    const namesArray = studentNames
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (namesArray.length === 0) {
      setErrorText('Введите хотя бы одно имя студента.');
      return;
    }

    // Железобетонно берем ID группы
    const currentGroupId = createdGroupId || useGroupStore.getState().group?.id;

    if (!currentGroupId) {
      setErrorText('Ошибка: ID группы не найден. Перезапустите страницу.');
      return;
    }

    // ВНИМАНИЕ: Передаем ключ group_id ровно так, как ждет axios и Pydantic!
    bulkCreateMutation.mutate({
      groupId: Number(currentGroupId), // для мутации локально
      names: namesArray
    });
  };


  // Финальный клик «Готово» на 3 шаге
  const handleFinalFinish = () => {
    isSuccessfullyDispatched.current = true;
    setCurrentStep(3); // Переводим степпер в финальную стадию, чтобы он зажегся зеленым!

    // Даем степперу доиграть анимацию успеха зеленого цвета, обновить кэш и закрываем лейаут
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['userMe'] });
      queryClient.invalidateQueries({ queryKey: ['myGroup'] });
      setNeedsGroupInit(false); // Выкидывает на интерфейс куратора
    }, 1200);
  };

  const handleCopyLink = (link, index) => {
    navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    if (tgHaptics?.selection) tgHaptics.selection();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Анимация слайдов (выезд справа налево)
  const slideVariants = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 }
  };

  return (
    <AppInitializer>
      <TelegramSafeProvider>
        <div className="flex-1 w-full flex flex-col items-center justify-between py-6 overflow-hidden">

          {/* Контентная зона со слайдером */}
          <div className="w-full flex-1 relative flex items-center justify-center overflow-y-auto scrollbar-none px-4">
            <AnimatePresence mode="wait">

              {/* ШАГ 0: Инициализация куратора */}
              {currentStep === 0 && (
                <motion.div key="slide-0" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-full max-w-md">
                  <GroupInitForm
                    onSubmit={handleFormSubmit}
                    isLoading={initGroupMutation.isPending}
                    error={errorText}
                  />
                </motion.div>
              )}

              {/* ШАГ 1: Ввод списка студентов */}
              {currentStep === 1 && (
                <motion.div key="slide-1" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-full max-w-md">
                  <GlassCard variant="form" className="gap-4 w-full">
                    <div className="flex flex-col gap-1 text-center mb-2">
                      <Typography variant="h3" className="font-black uppercase tracking-wider italic">Студенты группы</Typography>
                      <Typography variant="caption" className="opacity-60">Введите ФИО студентов группы (каждого с новой строки)</Typography>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      <textarea
                        value={studentNames}
                        onChange={(e) => setStudentNames(e.target.value)}
                        placeholder="Иванов Иван Иванович&#10;Петров Петр Петрович"
                        rows={6}
                        className="w-full p-4 rounded-xl border border-slate-900/15 bg-white/40 backdrop-blur-md text-slate-900 text-[14px] font-bold outline-none transition-all focus:bg-white/60 focus:border-slate-950 placeholder-slate-900/30 resize-none"
                      />
                    </div>

                    {errorText && (
                      <Typography variant="caption" className="text-accent-red font-extrabold italic pl-1">{errorText}</Typography>
                    )}

                    <PrimaryButton
                      onClick={handleStudentsSubmit}
                      isLoading={bulkCreateMutation.isPending}
                      className="w-full uppercase tracking-wider font-black italic"
                    >
                      Сгенерировать инвайты ({studentNames.split('\n').filter(n => n.trim()).length})
                    </PrimaryButton>
                  </GlassCard>
                </motion.div>
              )}

              {/* ШАГ 2: Показ сгенерированных ссылок */}
              {currentStep === 2 && (
                <motion.div key="slide-2" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-full max-w-md">
                  <GlassCard variant="form" className="gap-3 w-full">
                    <div className="flex flex-col gap-1 text-center mb-1">
                      <Typography variant="h3" className="font-black uppercase tracking-wider italic text-accent-purple">Ссылки созданы!</Typography>
                      <Typography variant="caption" className="opacity-60">Скопируйте и передайте ссылки студентам</Typography>
                    </div>

                    <div className="w-full max-h-[280px] overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-none">
                      {generatedLinks.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-slate-900/10 bg-white/20 backdrop-blur-sm">
                          <div className="flex flex-col gap-0.5 overflow-hidden pr-2">
                            <Typography variant="body" className="font-bold text-[13px] truncate text-slate-900">{item.name}</Typography>
                            <Typography variant="caption" className="text-[11px] opacity-50 truncate text-slate-600">{item.link}</Typography>
                          </div>
                          <button
                            onClick={() => handleCopyLink(item.link, index)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black italic uppercase tracking-wider transition-all border shrink-0 ${
                              copiedIndex === index
                                ? 'bg-accent-green/20 border-accent-green text-accent-green'
                                : 'bg-slate-900 text-white border-slate-900 active:scale-95'
                            }`}
                          >
                            {copiedIndex === index ? 'Готово' : 'Копировать'}
                          </button>
                        </div>
                      ))}
                    </div>

                    <PrimaryButton
                      onClick={handleFinalFinish}
                      className="w-full uppercase tracking-wider font-black italic"
                    >
                      Готово
                    </PrimaryButton>
                  </GlassCard>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* СТЕППЕР СНИЗУ КРАСИВО И СТАБИЛЬНО */}
          <div className="w-full max-w-md px-4 mt-4">
            <CyberStepper
              stepsCount={3}
              currentStep={currentStep > 2 ? 2 : currentStep}
              totalTicks={30}
            />
          </div>

        </div>
      </TelegramSafeProvider>
    </AppInitializer>
  );
};

export default GroupInitLayout;