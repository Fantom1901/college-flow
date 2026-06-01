import React, { useState } from 'react';
import Typography from '../../components/ui/typography/Typography.jsx';
import GlassCard from '../../components/ui/cards/GlassCard.jsx';
import WhiteCard from '../../components/ui/cards/WhiteCard.jsx';
import GlassButton from '../../components/ui/buttons/GlassButton.jsx';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton.jsx';
import ColoredButton from '../../components/ui/buttons/ColoredButton.jsx';
import TextInput from '../../components/ui/inputs/TextInput.jsx';
import Counter from '../../components/ui/inputs/Counter.jsx';
import Switch from '../../components/ui/toggles/Switch.jsx';
import Badge from '../../components/ui/feedback/Badge.jsx';
import CyberStepper from '../../components/ui/feedback/CyberStepper.jsx';
import CyberLoader from "../../components/ui/loaders/CyberLoader.jsx";

/**
 * @file ComponentSandboxView.jsx
 * @description Интерактивный экран-песочница для тестирования UI-компонентов системы в изоляции.
 */

/**
 * Компонент песочницы UI элементов.
 * @returns {React.JSX.Element}
 */
const ComponentSandboxView = () => {
  const [text, setText] = useState('');
  const [count, setCount] = useState(1);
  const [isSwitched, setIsSwitched] = useState(false);

  // Состояние для лоадера
  const [loaderStatus, setLoaderStatus] = useState('loading');

  // Стейт для тестирования степпера
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="w-full px-4 space-y-6 text-white">
      <div>
        <Typography variant="h1" className="text-xl font-bold text-accent-purple">
          UI Sandbox
        </Typography>
        <p className="text-xs text-slate-400">Тестирование атомарных компонентов в реальном времени</p>
      </div>

      {/* ТЕСТ СТЕППЕРА */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Typography variant="h2" className="text-sm font-semibold text-slate-300">
            CyberStepper (Steps: {currentStep + 1}/{totalSteps})
          </Typography>
          <Badge variant="purple">New</Badge>
        </div>

        <CyberStepper
          stepsCount={totalSteps}
          currentStep={currentStep}
          totalTicks={30}
          className="border-accent-purple/20"
        />

        <div className="flex gap-2 pt-2">
          <GlassButton
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="flex-1 text-xs"
          >
            Назад
          </GlassButton>
          <PrimaryButton
            onClick={handleNextStep}
            variant={"solid"}
            disabled={currentStep === totalSteps - 1}
            className="flex-1 text-xs"
          >
            Далее
          </PrimaryButton>
        </div>
      </GlassCard>

      {/* СЕКЦИЯ CYBER LOADER */}
      <GlassCard className="p-4 space-y-4">
        <Typography variant="h2" className="text-sm font-semibold text-slate-300">CyberLoader</Typography>

        <div className="flex justify-center py-4">
          <CyberLoader status={loaderStatus} size={64} />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setLoaderStatus('loading')}
            className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all ${loaderStatus === 'loading' ? 'bg-accent-purple/20 border-accent-purple text-accent-purple' : 'bg-slate-800 border-slate-700'}`}
          >
            Loading
          </button>
          <button
            onClick={() => setLoaderStatus('success')}
            className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all ${loaderStatus === 'success' ? 'bg-accent-green/20 border-accent-green text-accent-green' : 'bg-slate-800 border-slate-700'}`}
          >
            Success
          </button>
          <button
            onClick={() => setLoaderStatus('error')}
            className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all ${loaderStatus === 'error' ? 'bg-accent-red/20 border-accent-red text-accent-red' : 'bg-slate-800 border-slate-700'}`}
          >
            Error
          </button>
        </div>
      </GlassCard>

      {/* Секция кнопок */}
      <GlassCard className="p-4 space-y-3">
        <Typography variant="h2" className="text-sm font-semibold text-slate-300">Buttons</Typography>
        <div className="flex flex-col gap-2">
          <PrimaryButton onClick={() => {}}>Primary Button</PrimaryButton>
          <GlassButton onClick={() => {}}>Glass Button</GlassButton>
          <ColoredButton onClick={() => {}}>Colored Button</ColoredButton>
        </div>
      </GlassCard>

      {/* Секция инпутов и управления состоянием */}
      <GlassCard className="p-4 space-y-4">
        <Typography variant="h2" className="text-sm font-semibold text-slate-300">Inputs & Toggles</Typography>

        <div className="space-y-2">
          <label className="text-xs text-slate-400">Text Input State: "{text}"</label>
          <TextInput
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
          />
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-xs text-slate-400">Counter Component</span>
          <Counter value={count} onChange={setCount} min={1} max={5} />
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-xs text-slate-400">Switch Toggle</span>
          <Switch checked={isSwitched} onChange={setIsSwitched} />
        </div>
      </GlassCard>

      {/* Секция карточек и фидбэка */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-3 flex flex-col justify-between h-28">
          <span className="text-xs text-slate-400">GlassCard</span>
          <div className="flex gap-1">
            <Badge variant="purple">UI</Badge>
            <Badge variant="green">OK</Badge>
          </div>
        </GlassCard>

        <WhiteCard className="p-3 flex flex-col justify-between h-28 text-slate-900">
          <span className="text-xs text-slate-500">WhiteCard</span>
          <span className="text-xs font-bold">Light Mode Content</span>
        </WhiteCard>
      </div>
    </div>
  );
};

export default ComponentSandboxView;