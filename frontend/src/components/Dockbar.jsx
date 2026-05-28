import { Home } from 'lucide-react';
import { StarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import useAppStore from '../store/useAppStore';
import { ExchangeIcon } from './icons/ExchangeIcon';
import { SettingsIcon } from './icons/SetingsIcon.jsx';

const Dockbar = () => {
  const { activeTab, setActiveTab } = useAppStore();

  const menuItems = [
    { id: 'home', icon: Home },
    { id: 'exchange', icon: ExchangeIcon },
    { id: 'reviews', icon: StarIcon },
    { id: 'settings', icon: SettingsIcon },
  ];

  return (
    // Оставляем absolute, так как он внутри AppLayout
    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50">
      <div
        className="flex items-center justify-between bg-white/30 backdrop-blur-2xl border border-white/40 rounded-full p-[8px] relative w-[280px] h-[56px] shadow-2xl"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const neonStyle = item.id === 'settings'
            ? { filter: 'drop-shadow(0px 0px 12px rgba(191, 90, 242, 0.45))' }
            : { filter: 'drop-shadow(0px 0px 6px rgba(191, 90, 242, 0.8)) drop-shadow(0px 0px 15px rgba(191, 90, 242, 0.4))' };

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative w-[60px] h-[40px] flex items-center justify-center rounded-full outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  // Делаем пилюлю темной и глубокой, чтобы она "вырезалась" на стекле
                  className="absolute inset-0 bg-white rounded-full shadow-lg"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <Icon
                size={22}
                className={`relative z-10 transition-all duration-300 ${
                  isActive ? 'text-accent-purple' : 'text-slate-400'
                }`}
                style={isActive ? neonStyle : {}}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dockbar;