import { Heart, Globe, Users, Award, Map, Coffee, Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

export default function About() {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO
        title="Our 63-Year Legacy"
        description="Learn about the story of Arba Minch Wubeté Hotel — founded in 1962 and reborn as a modern luxury destination in the heart of the Ethiopian Rift Valley."
        path="/about"
        image="https://wubetehotel.com/building_night_1.png"
      />
      {/* ── Cinematic Hero ── */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 animate-[ken-burns_25s_ease-infinite_alternate]"
          style={{ backgroundImage: 'url(/building_night_1.png)' }}
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
                <Sparkles className="w-4 h-4" /> 63 Years
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-white mb-8 tracking-tighter leading-[0.85] italic drop-shadow-2xl">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed fade-up stagger-3">
              {t('about.hero.quote')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className="py-24 bg-mesh">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative fade-up stagger-1">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white/20 group aspect-[4/3]">
                <img
                  src="/building_night_1.png"
                  alt="Wubeté Hotel"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 premium-card p-6 hidden md:block">
                <div className="text-4xl font-serif font-black text-brand-burgundy mb-1 italic">63</div>
                <div className="text-[9px] font-black tracking-widest uppercase text-gray-500">{t('home.stats.years')}<br />Excellence</div>
              </div>
            </div>

            <div className="fade-up stagger-2 lg:pl-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-brand-gold rounded-full" />
                <span className="text-brand-burgundy/60 font-black tracking-[0.4em] uppercase text-[10px]">{t('about.story.vision')}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-8 leading-[1] tracking-tighter italic">
                {t('about.story.title')}
              </h2>

              <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed mb-10">
                <p>{t('about.story.p1')}</p>
                <p>{t('about.story.p2')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-xl font-serif font-bold text-brand-burgundy mb-1">1962</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('about.story.roots')}</div>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-xl font-serif font-bold text-brand-gold mb-1">Modern</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('about.story.modern')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-brand-burgundy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-burgundy via-[#2a1014] to-black opacity-80" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="text-brand-gold font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">{t('about.values.badge')}</span>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-16 italic tracking-tighter">{t('about.values.title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'Hospitality', desc: 'Genuine warmth and care in every interaction.' },
              { icon: Globe, title: 'Nature', desc: 'Preserving the natural ecosystem of the Rift Valley.' },
              { icon: Users, title: 'Community', desc: 'Empowering local staff and celebrating culture.' },
              { icon: Award, title: 'Excellence', desc: 'Uncompromising commitment to high standards.' }
            ].map((val, i) => (
              <div key={i} className="glass-card !border-white/10 !bg-white/5 p-8 rounded-[2rem] hover:!bg-brand-gold transition-all duration-500 group fade-up" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 bg-brand-gold/10 group-hover:bg-brand-burgundy rounded-[1rem] flex items-center justify-center mb-6 transition-colors shadow-inner mx-auto">
                  <val.icon className="w-6 h-6 text-brand-gold group-hover:text-white" />
                </div>
                <h3 className="text-xl font-serif font-black text-white group-hover:text-brand-burgundy mb-3 tracking-tighter italic">{val.title}</h3>
                <p className="text-sm text-white/50 group-hover:text-brand-burgundy/80 font-light leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Advantages ── */}
      <section className="py-24 bg-mesh">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-4xl md:text-5xl font-serif font-black text-gray-900 tracking-tighter italic">
              Arba Minch Advantage
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Map, title: 'Prime Location', desc: 'Situating scenic shores overlooking Lake Chamo.' },
              { icon: Coffee, title: 'Cultural Immersion', desc: 'Traditional Ethiopian coffee ceremonies daily.' },
              { icon: Building2, title: 'Modern Facilities', desc: 'Luxury suites and high-speed fiber internet.' },
              { icon: Sparkles, title: 'Expert Guides', desc: 'Dedicated tour desk with certified wildlife experts.' }
            ].map((feature, i) => (
              <div key={i} className="premium-card !p-8 group flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-14 h-14 bg-brand-burgundy/5 rounded-2xl flex items-center justify-center shadow-inner text-brand-burgundy group-hover:bg-brand-burgundy group-hover:text-white transition-colors shrink-0">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-32 bg-brand-gold/5 overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 fade-up">
          <span className="text-brand-burgundy font-black tracking-[0.6em] uppercase text-[10px] mb-8 block opacity-50">Start Your Journey</span>
          <h2 className="text-5xl md:text-7xl font-serif font-black text-brand-burgundy mb-12 italic tracking-tighter leading-tight">
            Write the Next Chapter<br />With Wubeté
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/booking"
              className="btn-premium"
            >
              Book Your Stay
            </Link>
            <Link
              to="/contact"
              className="btn-premium-outline !text-brand-burgundy !border-brand-burgundy"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
