import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('en') ? 'am' : 'en');
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/rooms', label: t('nav.rooms') },
    { path: '/dining', label: t('nav.dining') },
    { path: '/activities', label: t('nav.activities') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/services', label: t('nav.services') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Always use the premium pill header, even at the top of the home page so it stays visible
  const transparent = false;

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 w-full flex justify-center ${
          transparent
            ? 'top-0 px-0'
            : 'top-5 px-4 sm:px-6 lg:px-8'
        }`}
      >
        <div
          className={`w-full max-w-7xl mx-auto transition-all duration-500 ${
            transparent
              ? 'bg-transparent py-4 px-4 sm:px-6 lg:px-8 border border-transparent'
              : 'bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full py-1.5 px-6 sm:px-10 border border-white/60 text-brand-burgundy'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group relative">
              <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-[0.6rem] shadow-[0_0_30px_rgba(196,164,132,0.3)] border border-[#c4a484]/40 group-hover:border-[#c4a484] transition-all duration-700 bg-gradient-to-br from-[#2d1115] to-[#1a0a0c] p-0.5 group-hover:scale-105 group-hover:-rotate-3">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
                <img 
                  src="/logo_mark.jpg" 
                  alt="Logo" 
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 rounded-[0.5rem]" 
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className={`text-xl font-serif font-bold tracking-tight leading-none transition-colors duration-300 ${
                  transparent ? 'text-white' : 'text-brand-burgundy'
                }`}>
                Wubeté Hotel <span className='text-brand-burgundy'></span>
                </div>
                <div className={`text-[8px] tracking-[0.4em] uppercase font-black mt-0.5 transition-colors duration-300 ${
                  transparent ? 'text-brand-burgundy' : 'text-brand-burgundy'
                }`}>
                  Modern Luxury
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link px-3 py-1.5 text-[13px] font-bold rounded-lg transition-all duration-200 ${
                    isActive(link.path)
                      ? transparent
                        ? 'text-white bg-brand-burgundy/80 shadow-md backdrop-blur-md'
                        : 'text-white bg-brand-burgundy shadow-md'
                      : transparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-gray-700 hover:text-brand-burgundy hover:bg-gray-100'
                  } ${isActive(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-6">
              <a href={`tel:${import.meta.env.VITE_HOTEL_PHONE}`} className={`flex items-center space-x-2 font-medium transition-colors ${
                transparent ? 'text-white hover:text-[#c4a484]' : 'text-[#2d1115] hover:text-[#c4a484]'
              }`}>
                <Phone className="w-4 h-4" />
               <span className="text-sm">{import.meta.env.VITE_HOTEL_PHONE}</span>
              </a>
              <button 
                onClick={toggleLanguage}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-current transition-colors text-xs font-bold uppercase tracking-widest ${
                  transparent ? 'text-white hover:bg-white/10' : 'text-[#2d1115] hover:bg-[#2d1115]/5'
                }`}
              >
                <Globe className="w-4 h-4" />
                {i18n.language.startsWith('en') ? 'ENG' : 'አማ'}
              </button>
              <Link
                to="/booking"
                className="relative group overflow-hidden px-6 py-2 rounded-xl font-bold text-[13px] tracking-widest uppercase transition-all duration-500 shadow-xl active:scale-95 bg-gradient-to-r from-[#2d1115] to-[#4a1c22] text-[#fefaf0] hover:shadow-[#2d1115]/40"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('nav.book')} <span className="w-2 h-2 bg-[#c4a484] rounded-full animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#c4a484] to-[#d2b48c] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] transition-opacity" />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="block lg:hidden p-2 rounded-[0.75rem] transition-colors hover:bg-gray-100 text-brand-burgundy border border-gray-100 shadow-sm"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
                <div className="text-xl font-serif font-bold leading-tight text-brand-burgundy">
                  Arba Minch <span className="webete-brand-dark">Wubeté</span>
                </div>
                <div className="text-[9px] text-brand-burgundy tracking-[0.5em] uppercase font-black">Modern Luxury</div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-6 flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-yellow-50 text-brand-burgundy font-bold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-brand-burgundy'
                }`}
              >
                {link.label}
                <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
              </Link>
            ))}
          </nav>

          <div className="px-6 pt-4 border-t border-gray-100">
            <Link
              to="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-brand-burgundy text-brand-gold px-6 py-3.5 rounded-xl font-semibold text-center hover:bg-brand-burgundy transition-colors mb-4"
            >
              {t('nav.book_now')}
            </Link>
            <a
              href={`tel:${import.meta.env.VITE_HOTEL_PHONE}`}
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-brand-burgundy transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">{import.meta.env.VITE_HOTEL_PHONE}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
