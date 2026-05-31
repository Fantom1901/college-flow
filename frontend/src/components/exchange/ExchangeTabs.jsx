import React from 'react';
import GlassTabs from '../ui/inputs/GlassTabs.jsx';

export const ExchangeTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'incoming', label: 'Входящие' },
    { id: 'outgoing', label: 'Исходящие' },
    { id: 'history', label: 'История' },
  ];

  return (
    <GlassTabs
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      layoutId="active-exchange-tab"
    />
  );
};

export default ExchangeTabs;