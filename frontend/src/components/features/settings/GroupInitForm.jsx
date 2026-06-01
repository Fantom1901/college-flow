import React, { useState, useEffect } from 'react';
import GlassCard from "../../ui/cards/GlassCard.jsx";
import Typography from "../../ui/typography/Typography.jsx";
import TextInput from "../../ui/inputs/TextInput.jsx";
import PrimaryButton from "../../ui/buttons/PrimaryButton.jsx";
import { User, Users } from 'lucide-react';

/**
 * GroupInitForm - Форма инициализации группы куратором.
 * Полностью переписана на премиум-компоненты дизайн-системы College-Flow.
 * * Реализует одновременную валидацию полей с триггером нативных хэптик-ошибок
 * и синхронизацию ошибок ответа серверной части FastAPI.
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Коллбэк отправки чистых данных формы наверх
 * @param {boolean} props.isLoading - Состояние загрузки (мутации) для блокировки полей
 * @param {string} props.error - Сообщение об ошибке, прилетевшее с бэкенда
 */
export const GroupInitForm = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    groupName: ''
  });

  // Локальный стейт под ошибки каждого конкретного поля для одновременной подсветки
  const [errors, setErrors] = useState({
    fullName: '',
    groupName: ''
  });

  // Синхронизируем ошибку с бэка, если она прилетела из мутации лэйаута
  useEffect(() => {
    if (error) {
      setErrors((prev) => ({
        ...prev,
        groupName: error
      }));
    }
  }, [error]);

  /**
   * Обработчик изменения значения в полях ввода.
   * Мягко гасит ошибку только у редактируемого инпута.
   * * @param {string} field - Имя ключа в стейте формы (fullName / groupName)
   * @param {string} value - Чистая строка значения из TextInput
   */
  const handleFieldChange = (field, value) => {
    setErrors((prev) => ({
      ...prev,
      [field]: ''
    }));

    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Обработчик отправки формы.
   * Проводит комплексную валидацию всех полей перед триггером мутации.
   * * @param {Event} e - Нативное событие отправки формы HTML
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: !formData.fullName.trim() ? 'Пожалуйста, заполните ФИО' : '',
      groupName: !formData.groupName.trim() ? 'Пожалуйста, заполните название группы' : ''
    };

    // Если хотя бы одно поле пустое — подсвечиваем оба проблемных инпута
    if (newErrors.fullName || newErrors.groupName) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      fullName: formData.fullName.trim(),
      groupName: formData.groupName.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
            errorText={errors.fullName}
          />

          <TextInput
            label="Название группы"
            placeholder="Например, ИСП-21 или К-24"
            value={formData.groupName}
            onChange={(val) => handleFieldChange('groupName', val)}
            disabled={isLoading}
            icon={<Users />}
            errorText={errors.groupName}
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