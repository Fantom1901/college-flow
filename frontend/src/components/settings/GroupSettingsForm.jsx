import React, { useState } from 'react';
import { tgHaptics } from "../../../services/telegram/index.js";

// Импортируем наши атомы и молекулы
import GlassCard from '../ui/cards/GlassCard.jsx';
import FormRow from '../ui/inputs/FormRow.jsx';
import TabSelector from '../ui/inputs/TabSelector.jsx';
import MultiSelectGrid from '../ui/inputs/MultiSelectGrid.jsx';
import Counter from '../ui/inputs/Counter.jsx';
import PrimaryButton from '../ui/buttons/PrimaryButton.jsx';

const DAYS_OF_WEEK = [
  { id: 1, label: 'ПН' }, { id: 2, label: 'ВТ' }, { id: 3, label: 'СР' },
  { id: 4, label: 'ЧТ' }, { id: 5, label: 'ПТ' }, { id: 6, label: 'СБ' },
];

const MECHANISM_OPTIONS = [
  { id: 'alphabetical', label: 'По алфавиту' },
  { id: 'weighted', label: 'По баллам' },
];

function GroupSettingsForm({ initialSettings, onSave, isPending }) {
  const [mechanism, setMechanism] = useState(initialSettings?.mechanism || 'alphabetical');
  const [workDays, setWorkDays] = useState(initialSettings?.work_days || [1, 2, 3, 4, 5]);
  const [personPerDay, setPersonPerDay] = useState(initialSettings?.person_per_day || 2);

  const handleFormSubmit = async () => {
    try {
      await onSave({ mechanism, work_days: workDays, person_per_day: personPerDay });
      tgHaptics.notification('success');
    } catch (e) {
      tgHaptics.notification('error');
    }
  };

  return (
    <GlassCard variant="form">
      <FormRow label="Алгоритм распределения">
        <TabSelector
          options={MECHANISM_OPTIONS}
          value={mechanism}
          onChange={setMechanism}
          layoutId="active-mechanism-pill"
        />
      </FormRow>

      <FormRow label="Дни дежурств">
        <MultiSelectGrid
          items={DAYS_OF_WEEK}
          selectedIds={workDays}
          onChange={setWorkDays}
        />
      </FormRow>

      <FormRow label="Студентов на день">
        <Counter
          value={personPerDay}
          onChange={setPersonPerDay}
          min={1}
          max={5}
        />
      </FormRow>

      <PrimaryButton loading={isPending} onClick={handleFormSubmit}>
        {isPending ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ НАСТРОЙКИ'}
      </PrimaryButton>
    </GlassCard>
  );
}

export default GroupSettingsForm;