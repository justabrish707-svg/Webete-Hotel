import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, ArrowRight, Heart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    if (!isSupabaseConfigured) {
      setTimeout(() => { setStatus('success'); setEmail(''); }, 600);
      setTimeout(() => setStatus('idle'), 4500);
      return;
    }

    try {
      const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
      if (error) throw error;
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const quickLinks = [
    { path: '/rooms', label: t('nav.rooms') },
    { path: '/dining', label: t('nav.dining') },
    { path: '/activities', label: t('nav.activities') },
    { path: '/services', label: t('nav.services') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const socialLinks = [
    {
      href: 'https://www.facebook.com/share/18BBtwRqfn/',
      label: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
    },
    {
      href: 'https://www.instagram.com/wubete_hotel?igsh=MXhzbm9oem54MzdpZQ==',
      label: 'Instagram',
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      href: 'https://t.me/wubetehotel',
      label: 'Telegram',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.896-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      href: 'https://www.tiktok.com/@wubetehotel.arbaminch',
      label: 'TikTok',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#0d0407] text-gray-400">

      {/* ── Top CTA band ── */}
      <div className="relative bg-brand-burgundy overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/building_night_1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-3 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
                {t('footer.ready_title')}
              </h2>
              <p className="text-brand-gold/70 mt-1 font-medium">{t('footer.ready_subtitle')}</p>
            </div>
            <Link
              to="/booking"
              id="footer-book-btn"
              className="btn-shimmer flex items-center gap-3 bg-brand-gold text-brand-burgundy px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-brand-burgundy transition-all shadow-2xl whitespace-nowrap active:scale-95"
            >
              {t('nav.book')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* ── Brand column ── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 overflow-hidden rounded-2xl border border-brand-gold/30 shadow-2xl bg-brand-burgundy/30 flex-shrink-0">
                <img src="/logo_mark.jpg" alt="Wubeté Logo" className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <div className="text-white text-xl font-serif font-bold leading-tight">
                  Arba Minch <span className="text-brand-gold">Wubeté</span>
                </div>
                <div className="text-brand-gold/60 text-[9px] tracking-[0.5em] uppercase font-black mt-0.5">Modern Luxury</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-8 text-gray-500">
              {t('footer.brand_desc')}
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 bg-white/5 hover:bg-brand-burgundy text-gray-500 hover:text-brand-gold rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-brand-burgundy hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-white font-black mb-6 text-xs tracking-[0.3em] uppercase border-b border-white/5 pb-4">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm flex items-center gap-3 hover:text-brand-gold transition-colors group"
                  >
                    <span className="w-1 h-1 bg-brand-burgundy rounded-full group-hover:bg-brand-gold group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-white font-black mb-6 text-xs tracking-[0.3em] uppercase border-b border-white/5 pb-4">
              {t('footer.contact_us')}
            </h4>
            <ul className="space-y-5">
              <li>
                <a
                  href="https://maps.google.com/?q=Arbaminch+Wubete+Hotel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 hover:text-brand-gold transition-colors group"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-gold" />
                  <span className="text-sm leading-relaxed">
                    Sile Zerihun, Arbaminch<br />
                    Southern Nations, Ethiopia
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${import.meta.env.VITE_HOTEL_PHONE}`}
                  className="flex items-center gap-4 hover:text-brand-gold transition-colors group"
                >
                  <Phone className="w-4 h-4 flex-shrink-0 text-brand-gold" />
                  <span className="text-sm font-medium">{import.meta.env.VITE_HOTEL_PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${import.meta.env.VITE_HOTEL_EMAIL}`}
                  className="flex items-center gap-4 hover:text-brand-gold transition-colors group"
                >
                  <Mail className="w-4 h-4 flex-shrink-0 text-brand-gold" />
                  <span className="text-sm">{import.meta.env.VITE_HOTEL_EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/wubetehotel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 hover:text-brand-gold transition-colors group text-sm"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0 text-brand-gold" />
                  <span>@wubetehotel on Telegram</span>
                </a>
              </li>
            </ul>
          </div>

          {/* ── Newsletter ── */}
          <div>
            <h4 className="text-white font-black mb-6 text-xs tracking-[0.3em] uppercase border-b border-white/5 pb-4">
              {t('footer.newsletter')}
            </h4>
            <p className="text-sm mb-6 leading-relaxed text-gray-500">
              {t('footer.newsletter_desc')}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                id="newsletter-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('footer.newsletter_placeholder')}
                required
                disabled={status === 'loading' || status === 'success'}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/40 focus:bg-white/8 disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                id="newsletter-subscribe-btn"
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-brand-gold text-brand-burgundy px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-brand-burgundy transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95"
              >
                {status === 'loading' ? (
                  <><span className="w-4 h-4 border-2 border-brand-burgundy/30 border-t-brand-burgundy rounded-full animate-spin" />{t('footer.subscribing')}</>
                ) : status === 'success' ? (
                  `✓ ${t('footer.subscribed')}`
                ) : (
                  <><ArrowRight className="w-4 h-4" />{t('footer.subscribe')}</>
                )}
              </button>
              {status === 'success' && (
                <p className="text-brand-gold text-xs text-center font-medium">✨ Welcome to the Wubeté family!</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-xs text-center font-medium">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 text-center">
            © {new Date().getFullYear()} Arbaminch Wubeté Hotel. {t('footer.rights')}
            {' · '}
            <Link to="/admin" className="hover:text-brand-gold transition-colors">Admin Portal</Link>
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            {t('footer.made_with')}{' '}
            <Heart className="w-3 h-3 text-brand-gold fill-brand-gold inline-block" />
            {' '}{t('footer.in_ethiopia')}
          </div>
        </div>
      </div>
    </footer>
  );
}
