import React, { useState } from 'react';
import GlassCard from "../ui/cards/GlassCard.jsx";
import Typography from "../ui/typography/Typography.jsx";
import TextInput from "../ui/inputs/TextInput.jsx";
import PrimaryButton from "../ui/buttons/PrimaryButton.jsx";
import { User, Users } from 'lucide-react'; // Подкинул аккуратные иконки под контекст полей

/**
 * GroupInitForm - Форма инициализации группы куратором.
 * Полностью переписана на премиум-компоненты дизайн-системы College-Flow.
 */
export const GroupInitForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    groupName: ''
  });
  const [error, setError] = useState('');

  // Передаем изменения сразу как чистую строку из TextInput
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Валидация: оба поля обязательны
    if (!formData.fullName.trim() || !formData.groupName.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Отправляем чистые данные наверх
    onSubmit({
      fullName: formData.fullName.trim(),
      groupName: formData.groupName.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <GlassCard variant="form">
        {/* Хедер формы */}
        <div className="text-center flex flex-col gap-1">
          <Typography variant="h1">
            Регистрация куратора
          </Typography>
          <Typography variant="sub">
            Создание группы и настройка профиля
          </Typography>
        </div>

        {/* Блок инпутов */}
        <div className="flex flex-col gap-4 w-full">
          <TextInput
            label="Ваше ФИО"
            placeholder="Иванов Иван Иванович"
            value={formData.fullName}
            onChange={(val) => handleFieldChange('fullName', val)}
            disabled={isLoading}
            icon={<User />}
          />

          <TextInput
            label="Название группы"
            placeholder="Например, ИСП-21 или К-24"
            value={formData.groupName}
            onChange={(val) => handleFieldChange('groupName', val)}
            disabled={isLoading}
            icon={<Users />}
            errorText={error} // Если поля пустые, TextInput сам включит haptic error и подсветит рамку
          />
        </div>

        {/* Главная кнопка отправки формы */}
        <PrimaryButton type="submit" loading={isLoading}>
          Создать группу и войти
        </PrimaryButton>
      </GlassCard>
    </form>
  );
};

export default GroupInitForm;