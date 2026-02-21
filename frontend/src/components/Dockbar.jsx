import { Home, ArrowLeftRight, Settings } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const Dockbar = () => {
  const { activeTab, setActiveTab } = useAppStore();

  const tabs = [
    { id: 'home', icon: Home },
    { id: 'exchange', icon: ArrowLeftRight },
    { id: 'settings', icon: Settings },
  ];

  return (
    <>
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 backdrop-blur-md bg-fill-quaternary"></div>
    </>
  );
};

export default Dockbar;