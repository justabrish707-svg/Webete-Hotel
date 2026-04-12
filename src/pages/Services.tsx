import { Clock, Car, Wifi, Briefcase, Shirt, Phone, MapPin, Utensils, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Clock,
      title: t('services.items.reception.title'),
      description: t('services.items.reception.desc'),
      color: 'from-amber-50 to-yellow-50',
    },
    {
      icon: Car,
      title: t('services.items.shuttle.title'),
      description: t('services.items.shuttle.desc'),
      color: 'from-slate-50 to-gray-50',
    },
    {
      icon: Wifi,
      title: t('services.items.wifi.title'),
      description: t('services.items.wifi.desc'),
      color: 'from-blue-50 to-indigo-50',
    },
    {
      icon: Briefcase,
      title: t('services.items.conference.title'),
      description: t('services.items.conference.desc'),
      color: 'from-stone-50 to-neutral-50',
    },
    {
      icon: Shirt,
      title: t('services.items.laundry.title'),
      description: t('services.items.laundry.desc'),
      color: 'from-rose-50 to-pink-50',
    },
    {
      icon: Phone,
      title: t('services.items.concierge.title'),
      description: t('services.items.concierge.desc'),
      color: 'from-emerald-50 to-teal-50',
    },
    {
      icon: MapPin,
      title: t('services.items.tour.title'),
      description: t('services.items.tour.desc'),
      color: 'from-orange-50 to-amber-50',
    },
    {
      icon: Utensils,
      title: t('services.items.room_service.title'),
      description: t('services.items.room_service.desc'),
      color: 'from-violet-50 to-purple-50',
    },
  ];

  return (
    <Layout>
      <SEO
        title="Services & Amenities"
        description="Explore the full range of premium services at Arba Minch Wubeté Hotel — 24/7 reception, airport shuttle, free WiFi, conference rooms, laundry, room service & more."
        path="/services"
      />
      {/* ── Editorial Hero ── */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 animate-[ken-burns_25s_ease-infinite_alternate] bg-[url(/images/hero/hallfacility1.webp)]"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-burgundy/30 to-brand-burgundy/90" />

        {/* Decorative Wave Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-10">
          <svg className="w-full h-24 text-mesh fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,80 C480,120 960,0 1440,80 L1440,100 L0,100 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl fade-up">
            <div className="flex items-center gap-4 mb-8 fade-up stagger-1">
              <span className="w-16 h-[2px] bg-brand-gold rounded-full"></span>
              <span className="text-brand-gold font-bold tracking-[0.5em] uppercase text-xs flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {t('services.hero.badge')}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-white mb-8 tracking-tighter leading-[0.85] italic drop-shadow-2xl">
              {t('services.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed fade-up stagger-3">
              {t('services.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24 bg-mesh">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 fade-up text-center">
            <span className="text-brand-burgundy/60 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">World-Class Amenities</span>
            <h2 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6 leading-[1] tracking-tighter italic">
              {t('services.header.title').split(' ')[0]}{' '}
              <span className="text-brand-gold">{t('services.header.title').split(' ').slice(1).join(' ')}</span>
            </h2>
            <div className="w-20 h-1 bg-brand-gold mx-auto rounded-full mb-8" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              {t('services.header.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="fade-up premium-card group flex flex-col p-8 transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(45,17,21,0.1)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <service.icon className="w-16 h-16 text-brand-burgundy" />
                </div>
                <div className="w-14 h-14 bg-brand-burgundy/5 shadow-inner rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-burgundy transition-all duration-500 group-hover:rotate-6">
                  <service.icon className="w-6 h-6 text-brand-burgundy group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-brand-burgundy transition-colors uppercase tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-medium text-sm flex-grow">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business Facilities ── */}
      <section className="py-24 bg-brand-burgundy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-burgundy via-[#2a1014] to-black opacity-80" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative fade-up">
              <div className="absolute -inset-6 bg-brand-gold/10 rounded-[2rem] -rotate-3 border border-white/5" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[4px] border-white/10 group aspect-[4/3]">
                <img
                  src="/images/hero/hallfacility1.webp"
                  alt="Wubeté Conference Facilities"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8 right-8 glass-card !border-white/20 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 rounded-2xl">
                  <span className="text-brand-gold font-black text-[10px] tracking-widest uppercase">Premium Venue</span>
                  <p className="font-serif font-black text-white text-xl mt-2 tracking-tighter italic">Capacity: 10–250 Guests</p>
                </div>
              </div>
            </div>

            <div className="fade-up lg:pl-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-brand-gold rounded-full" />
                <span className="text-brand-gold/80 font-black tracking-[0.4em] uppercase text-[10px]">Professional Events</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-black text-white mb-8 leading-[1] tracking-tighter italic">
                Business <span className="text-brand-gold">Facilities</span>
              </h2>
              
              <p className="text-lg text-white/70 leading-relaxed mb-8 font-light">
                Our state-of-the-art conference rooms and business centre are ideal for meetings, seminars, and corporate retreats — surrounded by the natural grandeur of the Rift Valley.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Meeting rooms for 10–250 attendees',
                  'HD audio-visual & projection systems',
                  'Fiber-optic WiFi & video conferencing',
                  'Executive catering for all events',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-5 glass-card !bg-white/5 !border-white/10 p-5 rounded-2xl group hover:!bg-brand-gold transition-all duration-500">
                    <div className="w-4 h-4 bg-white/20 rounded-[0.25rem] flex-shrink-0 group-hover:bg-brand-burgundy transition-colors flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-brand-gold group-hover:bg-brand-gold rounded-full" />
                    </div>
                    <span className="text-white font-bold group-hover:text-brand-burgundy transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="btn-premium flex items-center justify-center gap-2 w-full sm:w-max"
              >
                Request Venue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-32 bg-brand-gold/5 overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 fade-up">
          <span className="text-brand-burgundy font-black tracking-[0.6em] uppercase text-[10px] mb-8 block opacity-50">Concierge Desk</span>
          <h2 className="text-5xl md:text-7xl font-serif font-black text-brand-burgundy mb-12 italic tracking-tighter leading-tight">
            Need Special <span className="text-brand-gold">Arrangements?</span>
          </h2>
          <p className="text-2xl text-brand-burgundy/60 font-light mb-16 mx-auto italic leading-relaxed">
            Our dedicated concierge team is available around the clock to help with any special requests, making your stay absolutely flawless.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={`tel:${import.meta.env.VITE_HOTEL_PHONE || '+251468812345'}`}
              className="btn-premium"
            >
              Call Concierge
            </a>
            <Link
              to="/contact"
              className="text-brand-burgundy/70 hover:text-brand-gold font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors ml-4"
            >
              Or send a message <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
