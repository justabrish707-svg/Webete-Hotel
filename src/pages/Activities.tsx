import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ship, Mountain, Camera, Compass, Users, Map, Coffee } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

export default function Activities() {
  const { t } = useTranslation();

  const mainActivities = [
    {
      icon: Ship,
      category: 'Safari',
      title: t('activities.items.lake.title'),
      description: t('activities.items.lake.desc'),
      image: '/images/activities/chamoboattrip.webp',
      duration: '4-5 Hours',
      level: 'Easy'
    },
    {
      icon: Mountain,
      category: 'Nature',
      title: t('activities.items.park.title'),
      description: t('activities.items.park.desc'),
      image: '/images/activities/nechisarpark1.webp',
      duration: 'Full Day',
      level: 'Moderate'
    },
    {
      icon: Users,
      category: 'Culture',
      title: t('activities.items.village.title'),
      description: t('activities.items.village.desc'),
      image: '/images/activities/dorzevillage11.webp',
      duration: '4 Hours',
      level: 'Easy'
    }
  ];

  return (
    <Layout>
      <SEO
        title="Safari & Rift Valley Adventures"
        description="Discover curated adventures from Arba Minch Wubeté Hotel — Lake Chamo boat safaris, Nechisar National Park tours, Dorze village cultural experiences & more."
        path="/activities"
        image="https://wubetehotel.com/images/activities/chamoboattrip.webp"
      />
      {/* ── Hero ── */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 animate-[ken-burns_25s_ease-infinite_alternate] bg-[url(/images/gallery/naturesafarihd.webp)]"
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
                <Compass className="w-4 h-4" /> Rift Valley Adventures
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-white mb-8 tracking-tighter leading-[0.85] italic drop-shadow-2xl">
              {t('activities.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed fade-up stagger-3">
              {t('activities.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Activities ── */}
      <section className="py-24 bg-mesh">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 fade-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-brand-gold rounded-full" />
              <span className="text-brand-burgundy/60 font-black tracking-[0.4em] uppercase text-[10px]">Curated Experiences</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6 leading-[1] tracking-tighter italic">
              Explore Arbaminch
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-light max-w-2xl">
              {t('activities.header.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainActivities.map((act, i) => (
              <div key={i} className={`fade-up premium-card group flex flex-col overflow-hidden !p-2 stagger-${i + 1}`}>
                <div className="h-64 overflow-hidden relative rounded-[1rem] aspect-[4/3] shadow-inner">
                  <img src={act.image} alt={act.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 px-4 py-1.5 glass-card !border-white/20 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                    {act.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-brand-burgundy/5 rounded-xl flex items-center justify-center text-brand-burgundy group-hover:bg-brand-burgundy group-hover:text-white transition-all duration-500 hover:rotate-6">
                      <act.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-gray-900 group-hover:text-brand-burgundy transition-colors tracking-tight italic leading-none">{act.title}</h3>
                  </div>
                  
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 flex-grow">{act.description}</p>
                  
                  <div className="flex justify-between items-center mb-8 py-4 border-y border-gray-100/50 px-2 bg-gray-50/50 rounded-xl">
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Duration</span>
                      <span className="text-sm font-bold text-brand-burgundy">{act.duration}</span>
                    </div>
                    <div className="flex flex-col items-end border-l border-gray-200 pl-6">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Level</span>
                      <span className="text-sm font-bold text-brand-burgundy">{act.level}</span>
                    </div>
                  </div>

                  <Link
                    to={`/contact?subject=Tour Inquiry: ${act.title}`}
                    className="btn-premium w-full text-center group-hover:-translate-y-1"
                  >
                    Inquire Tour
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Adventure Grid ── */}
      <section className="py-24 bg-brand-burgundy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-burgundy via-[#2a1014] to-black opacity-80" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 fade-up text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tighter italic lg:max-w-2xl mx-auto">
              More Adventures Await
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: 'Sport Fishing', desc: 'Expert local guides and gear provided.', icon: Ship },
              { title: 'Mountain Trekking', desc: 'Scenic mountain trails with valley views.', icon: Mountain },
              { title: 'Bird Watching', desc: 'Discover over 350 bird species.', icon: Camera },
              { title: 'Cultural Crafts', desc: 'Witness the craftsmanship of Dorze weavers.', icon: Users },
              { title: 'Sunset Views', desc: 'Overlooking both Lake Chamo and Abaya.', icon: Map },
              { title: 'Coffee Ritual', desc: 'Authentic Arba Minch coffee roasting.', icon: Coffee }
            ].map((item, i) => (
              <div key={i} className={`fade-up p-8 glass-card !border-white/10 !bg-white/5 group flex flex-col items-center text-center hover:!bg-brand-gold hover:-translate-y-2 transition-all duration-500 stagger-${i + 1}`} >
                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                  <item.icon className="w-6 h-6 text-brand-gold group-hover:text-brand-burgundy" />
                </div>
                <h3 className="text-lg font-black text-white mb-3 group-hover:text-brand-burgundy transition-colors tracking-tight italic">{item.title}</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed group-hover:text-brand-burgundy/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-32 bg-brand-gold/5 overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 fade-up">
          <span className="text-brand-burgundy font-black tracking-[0.6em] uppercase text-[10px] mb-8 block opacity-50">Concierge Desk</span>
          <h2 className="text-5xl md:text-7xl font-serif font-black text-brand-burgundy mb-12 italic tracking-tighter leading-tight">
            Ready to Explore?
          </h2>
          <p className="text-2xl text-brand-burgundy/60 font-light mb-16 mx-auto italic leading-relaxed">
            Our expert tour desk is standing by to craft your personalized Rift Valley itinerary. 
          </p>
          <div className="flex justify-center">
            <Link
              to="/contact?subject=General Tour Inquiry"
              className="btn-premium"
            >
              Contact Tour Desk
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
