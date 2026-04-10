import { Link, useLocation } from 'react-router-dom';
import { Home, BedDouble, CalendarPlus, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MobileNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/rooms', label: t('nav.rooms'), icon: BedDouble },
    { path: '/booking', label: t('nav.book'), icon: CalendarPlus },
    { id: 'menu', label: 'More', icon: Menu }, 
  ];

  const handleMenuClick = () => {
    // Trigger the existing mobile menu overlay in Header
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    if (toggleBtn) {
      toggleBtn.click();
    }
  };

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[60]">
      <div className="bg-[#1a0a0c]/95 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] p-2 flex justify-around items-center shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item, idx) => {
          if (item.id === 'menu') {
            return (
              <button
                key={idx}
                onClick={handleMenuClick}
                className="relative flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all duration-300 text-white/50 hover:text-white"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            );
          }

          const isActive = location.pathname === item.path;
          return (
            <Link
              key={idx}
              to={item.path!}
              className={`relative flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all duration-500 ${
                isActive 
                  ? 'text-[#1a0a0c] bg-brand-gold shadow-[0_0_15px_rgba(196,164,132,0.4)] scale-110 -translate-y-2' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isActive ? (
                <span className="text-[8px] font-black uppercase tracking-widest leading-none mt-0.5">{item.label}</span>
              ) : (
                <span className="text-[8px] font-bold tracking-widest uppercase leading-none opacity-80">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
