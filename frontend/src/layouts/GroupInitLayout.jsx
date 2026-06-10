import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import TelegramSafeProvider from '../providers/TelegramSafeProvider.jsx';
import AppInitializer from "../components/status/AppInitializer.jsx";
import { GroupInitForm } from "../components/features/settings/GroupInitForm.jsx";

import GlassCard from '../components/ui/cards/GlassCard.jsx';
import Typography from '../components/ui/typography/Typography.jsx';
import PrimaryButton from '../components/ui/buttons/PrimaryButton.jsx';
import CyberStepper from '../components/ui/feedback/CyberStepper.jsx';

import useAppStore from '../store/useAppStore.js';
import useGroupStore from '../store/useGroupStore.js';
import { groupsApi } from '../api/groups.js';
import { inviteApi } from '../api/invite.js';
import { tgHaptics } from "../../services/telegram/index.js";
import { simulateGroupInitialization } from '../../services/initApp.js';

const GroupInitLayout = () => {
  const queryClient = useQueryClient();
  const user = useAppStore((state) => state.user);
  const setNeedsGroupInit = useAppStore((state) => state.setNeedsGroupInit);

  const [currentStep, setCurrentStep] = useState(0);
  const [errorText, setErrorText] = useState('');
  const [studentNames, setStudentNames] = useState('');
  const [generatedLinks, setGeneratedLinks] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [createdGroupId, setCreatedGroupId] = useState(null);

  const isSuccessfullyDispatched = useRef(false);

  const initGroupMutation = useMutation({
    mutationFn: async (fullPayload) => {
      if (import.meta.env.DEV) return simulateGroupInitialization(fullPayload, queryClient);
      return groupsApi.initGroup(fullPayload);
    },
    onSuccess: (data, variables) => {
      if (tgHaptics?.notification) tgHaptics.notification('success');
      setCreatedGroupId(data.group_id);
      if (!import.meta.env.DEV) {
        useGroupStore.getState().setGroup({ id: data.group_id, name: data.group_name, students: [] });
        useAppStore.getState().setUser({ ...user, curator_profile: { id: data.group_id, full_name: variables.full_name, group_id: data.group_id } });
      }
      setCurrentStep(1);
    },
    onError: (err) => {
      if (tgHaptics?.notification) tgHaptics.notification('error');
      setErrorText(err?.response?.data?.detail || 'Ошибка создания группы.');
    }
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async ({ groupId, names }) => {
      return inviteApi.bulkCreate(groupId, names);
    },
    onSuccess: (data) => {
      if (tgHaptics?.notification) tgHaptics.notification('success');
      setGeneratedLinks(data);
      setCurrentStep(2);
    },
    onError: (err) => {
      if (tgHaptics?.notification) tgHaptics.notification('error');
      setErrorText(err?.response?.data?.detail || 'Ошибка генерации ссылок.');
    }
  });

  const handleFormSubmit = (formData) => {
    if (initGroupMutation.isPending) return;
    const cleanTgId = parseInt(user?.tg_id || window.Telegram?.WebApp?.initDataUnsafe?.user?.id, 10);
    initGroupMutation.mutate({
      invite_code: 'default_curator_code',
      full_name: String(formData.fullName).trim(),
      group_name: String(formData.groupName).trim(),
      tg_id: cleanTgId,
      username: user?.username || window.Telegram?.WebApp?.initDataUnsafe?.user?.username || null
    });
  };

  const handleStudentsSubmit = () => {
    const namesArray = studentNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    const groupId = createdGroupId || useGroupStore.getState().group?.id;
    if (!groupId) return setErrorText('Ошибка ID группы.');
    bulkCreateMutation.mutate({ groupId, names: namesArray });
  };

  const handleFinalFinish = () => {
    setCurrentStep(3);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['userMe'] });
      setNeedsGroupInit(false);
    }, 1200);
  };

  return (
    <AppInitializer>
      <TelegramSafeProvider>
        <div className="flex-1 w-full flex flex-col items-center justify-between py-6 overflow-hidden">
          <div className="w-full flex-1 relative flex items-center justify-center overflow-y-auto px-4">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div key="step0" exit={{ x: '-100%', opacity: 0 }} className="w-full max-w-md">
                  <GroupInitForm onSubmit={handleFormSubmit} isLoading={initGroupMutation.isPending} error={errorText} />
                </motion.div>
              )}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-md">
                  <GlassCard variant="form" className="gap-4">
                    <textarea value={studentNames} onChange={(e) => setStudentNames(e.target.value)} className="w-full p-4 rounded-xl bg-white/40 border border-slate-900/15" placeholder="ФИО студентов..." rows={6} />
                    <PrimaryButton onClick={handleStudentsSubmit} isLoading={bulkCreateMutation.isPending}>Сгенерировать</PrimaryButton>
                  </GlassCard>
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-md">
                  <GlassCard variant="form" className="gap-2">
                    {generatedLinks.map((item, i) => <div key={i} className="p-2 border rounded">{item.name}: {item.link}</div>)}
                    <PrimaryButton onClick={handleFinalFinish}>Готово</PrimaryButton>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="w-full max-w-md px-4 mt-4">
            <CyberStepper stepsCount={3} currentStep={currentStep > 2 ? 2 : currentStep} totalTicks={30} />
          </div>
        </div>
      </TelegramSafeProvider>
    </AppInitializer>
  );
};

export default GroupInitLayout;