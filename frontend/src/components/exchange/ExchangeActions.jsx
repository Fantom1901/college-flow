import React from 'react';
import { Check, X, Ban } from 'lucide-react';
import Badge from '../ui/feedback/Badge.jsx';
import GlassButton from '../ui/buttons/GlassButton.jsx';

export const ExchangeActions = ({ exchangeId, activeTab, status, onUpdateStatus, isLoading }) => {

  // 1. История
  if (activeTab === 'history') {
    const statusMap = {
      accepted: { label: 'Принято', variant: 'green' },
      rejected: { label: 'Отклонено', variant: 'red' },
      default: { label: 'Отменено', variant: 'gray' }
    };
    const { label, variant } = statusMap[status] || statusMap.default;
    return <Badge variant={variant}>{label}</Badge>;
  }

  // 2. Исходящие
  if (activeTab === 'outgoing') {
    return (
      <GlassButton
        loading={isLoading}
        onClick={() => onUpdateStatus(exchangeId, 'cancelled')}
        icon={<Ban size={14} />}
        className="text-accent-orange"
      >
        Отменить
      </GlassButton>
    );
  }

  // 3. Входящие
  return (
    <div className="flex items-center gap-2 w-full justify-between">
      <GlassButton
        loading={isLoading}
        onClick={() => onUpdateStatus(exchangeId, 'rejected')}
        icon={<X size={14} />}
        className="text-accent-red"
      >
        Отклонить
      </GlassButton>

      <GlassButton
        loading={isLoading}
        onClick={() => onUpdateStatus(exchangeId, 'accepted')}
        density="dense"
        icon={<Check size={14} />}
        className="text-accent-green"
      >
        Принять
      </GlassButton>
    </div>
  );
};

export default ExchangeActions;