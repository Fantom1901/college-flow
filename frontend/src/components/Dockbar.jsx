import {Home} from 'lucide-react';
import {motion} from 'framer-motion'; // Импортируем motion
import useAppStore from '../store/useAppStore';
import {ExchangeIcon} from './icons/ExchangeIcon';
import {SettingsIcon} from './icons/SetingsIcon.jsx';

const Dockbar = () => {
  const {activeTab, setActiveTab} = useAppStore();

  const menuItems = [
    {id: 'home', icon: Home},
    {id: 'exchange', icon: ExchangeIcon},
    {id: 'settings', icon: SettingsIcon},
  ];

  return (
    <div className="fixed z-50 bottom-7 left-1/2 -translate-x-1/2">
      <div
        className="flex items-center justify-between bg-fill-TabBar backdrop-blur-[var(--backdrop-blur-TabBar)] border border-separator-opaque rounded-full p-[9px] relative w-[218px] h-[56px] shadow-[var(--shadow-TabBar-inner)]">

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative w-[56px] h-[40px] flex items-center justify-center rounded-full outline-none transition-colors duration-300"
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill" // Магия: Framer свяжет элементы с этим ID
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 27, // Настрой эти числа для изменения силы "пружины"
                  }}
                />
              )}

              <Icon
                className={`relative z-10 transition-all duration-300 ${
                  isActive
                    ? 'text-accent-purple'
                    : 'text-white'
                }`}
                style={isActive ? {
                  filter: 'drop-shadow(0px 0px 12px rgba(191, 90, 242, 0.5))'
                } : {}}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dockbar;