import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wifi, Tv, Coffee, CheckCircle2, Star, ShieldCheck, Sparkles, Wind, Utensils, Mountain } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

export default function Rooms() {
  const { t } = useTranslation();

  const rooms = [
    {
      id: 'standard',
      name: t('rooms.types.standard.name'),
      title: t('rooms.types.standard.title'),
      price: '1,500',
      image: '/webete_bedroom_1.jpg',
      description: t('rooms.types.standard.desc'),
      maxOccupancy: 2,
      size: '25 sqm',
      bedType: 'Queen Bed',
      tag: 'Heritage Comfort',
      highlights: [t('home.highlights.wifi'), t('about.story.roots')],
      amenities: [
        { icon: Wifi, label: 'Fiber WiFi' },
        { icon: Tv, label: 'Smart TV' },
        { icon: Wind, label: 'Climate' },
        { icon: Coffee, label: 'Coffee' }
      ]
    },
    {
      id: 'deluxe',
      name: t('rooms.types.deluxe.name'),
      title: t('rooms.types.deluxe.title'),
      price: '2150',
      image: '/deluxe_room_2.webp',
      description: t('rooms.types.deluxe.desc'),
      maxOccupancy: 3,
      size: '35 sqm',
      bedType: 'King Bed',
      tag: 'Lake View',
      highlights: [t('home.exp.lake'), 'Mini Bar'],
      amenities: [
        { icon: Wifi, label: 'WiFi' },
        { icon: Tv, label: '4K TV' },
        { icon: Coffee, label: 'Espresso' },
        { icon: ShieldCheck, label: 'Safety' }
      ]
    },
    {
      id: 'executive',
      name: t('rooms.types.executive.name'),
      title: t('rooms.types.executive.title'),
      price: '3450',
      image: '/webete_bedroom_3.jpg',
      description: t('rooms.types.executive.desc'),
      maxOccupancy: 4,
      size: '55 sqm',
      bedType: 'California King',
      tag: 'Presidential',
      highlights: ['Living Area', 'Balcony'],
      amenities: [
        { icon: Coffee, label: 'Nespresso' },
        { icon: Utensils, label: 'Dining' },
        { icon: Mountain, label: 'Mountain' },
        { icon: Sparkles, label: 'VIP' }
      ]
    }
  ];

  return (
    <Layout>
      <SEO
        title="Luxury Suites & Rooms"
        description="Explore our curated collection of premium suites at Arba Minch Wubeté Hotel — from standard garden-view rooms to executive Rift Valley suites."
        path="/rooms"
        image="https://wubetehotel.com/webete_bedroom_3.jpg"
      />
      {/* ── Cinematic Hero ── */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 animate-[ken-burns_25s_ease-infinite_alternate] bg-[url(/webete_bedroom_3.jpg)]"
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
                <Star className="w-4 h-4" /> 5-Star Haven
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-white mb-8 leading-[0.85] tracking-tighter fade-up stagger-2 drop-shadow-2xl italic">
              Our <span className="not-italic text-brand-gold/90 font-extralight">Suites</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed fade-up stagger-3">
              {t('rooms.hero_subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Room Experience Grid ── */}
      <section className="py-12 bg-mesh">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight italic">
              Our Sanctuary
            </h2>
            <p className="text-sm text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
              {t('rooms.header_desc')}
            </p>
          </div>

          <div className="space-y-24">
            {rooms.map((room, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center fade-up`}>
                {/* Visual Story */}
                <div className="relative w-full lg:w-1/2 group">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white cls-box aspect-room">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="w-full h-full object-cover img-enhance"
                    />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
                      <div>
                        <span className="text-brand-gold text-[9px] font-black uppercase tracking-widest mb-1 block">{room.tag}</span>
                        <h3 className="text-xl font-serif font-bold italic">{room.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Narrative Info */}
                <div className="w-full lg:w-1/2">
                  <div className="max-w-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-1 bg-brand-gold rounded-full" />
                      <span className="text-brand-gold/80 font-black text-[10px] uppercase tracking-[0.4em]">{room.name}</span>
                    </div>
                    <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                      {room.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-8">
                      {room.highlights.map((h, hi) => (
                        <div key={hi} className="px-5 py-2 glass-card !border-gray-200/50 rounded-full text-brand-burgundy font-bold text-[9px] flex items-center gap-2 shadow-sm">
                           <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                           <span className="tracking-widest uppercase">{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-10">
                      {room.amenities.map((item, ai) => (
                        <div key={ai} className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-[1rem] flex items-center justify-center border border-gray-200/50 shadow-sm hover:scale-110 hover:bg-brand-burgundy hover:text-white transition-all duration-300 text-brand-burgundy group/icon">
                             <item.icon className="w-5 h-5 transition-colors" />
                          </div>
                          <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="premium-card flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-brand-burgundy w-full gap-6">
                      <div className="flex flex-col border-l-2 border-brand-gold pl-5">
                         <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-1">Special Rate</span>
                         <span className="text-3xl font-serif font-black text-white tracking-tighter italic">{room.price} <span className="text-[12px] font-bold opacity-60 not-italic">ETB</span></span>
                      </div>
                      <Link
                        to={`/booking?room=${room.id}`}
                        className="btn-premium flex items-center justify-center gap-2 w-full sm:w-auto text-center"
                      >
                         {t('rooms.labels.book_btn')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Concierge ── */}
      <section className="relative py-16 bg-[#1a0a0c] overflow-hidden text-center">
        <div className="absolute inset-0 bg-mesh opacity-5" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-8 leading-tight tracking-tight">
            Designed for <span className="text-brand-gold italic">Pure Serenity</span>
          </h2>
          <Link
            to="/contact"
            className="btn-premium !bg-brand-gold !text-brand-burgundy hover:!bg-white"
          >
            Consult Our Team
          </Link>
        </div>
      </section>
    </Layout>
  );
}
