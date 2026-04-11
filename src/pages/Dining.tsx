import { useState } from 'react';
import { Coffee, Utensils, Wine, Star, Heart, Clock, ChevronRight, Leaf, Info, MapPin, Flame, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

export default function Dining() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('Traditional');

  const menuItems = [
    {
      category: 'Traditional',
      title: t('Traditional Agelgil') || 'Grand Heritage Platter',
      desc: 'A full spectrum of Ethiopian flavors: Doro Wat, Kitfo, and Gomen served on fresh Injera.',
      price: '550 ETB',
      image: '/food Traditional_1.png',
      tag: 'Chef\'s Signature',
      info: 'Organic Teff • Spicy • Serves 2',
      calories: '1120 kcal',
      chefNote: 'Our Berbere blend is aged for 6 weeks for optimal depth.'
    },
    {
      category: 'Traditional',
      title: t('grilled fish') || 'Rift Valley Tilapia',
      desc: 'Whole grilled fish from Lake Chamo, marinated in local herbs and Berbere spice.',
      price: '420 ETB',
      image: '/grilled-fish.jpg',
      tag: 'Fresh Catch',
      info: 'Lakeside • Grilled • Low Carb',
      calories: '450 kcal',
      chefNote: 'Delivered fresh every morning at 5:00 AM from the lake.'
    },
    {
      category: 'International',
      title: 'Aged Ribeye Steak',
      desc: '28-day dry-aged premium beef served with a velvety red wine reduction and truffle-infused mash.',
      price: '850 ETB',
      image: '/assets/menu/ribeye_steak_gourmet_1775139407503.png',
      tag: 'Premium Selection',
      info: 'Imported Beef • Gourmet • Wood-Fired',
      calories: '780 kcal',
      chefNote: 'Grass-fed beef, seared at 400°C for the perfect crust.'
    },
    {
      category: 'International',
      title: 'Mediterranean Seafood Pasta',
      desc: 'Hand-crafted linguine tossed with jumbo prawns, cherry tomatoes, and cold-pressed olive oil.',
      price: '580 ETB',
      image: '/assets/menu/mediterranean_pasta_premium_1775139434195.png',
      tag: 'House Favorite',
      info: 'Fresh Seafood • Garlic • Basil',
      calories: '620 kcal',
      chefNote: 'Our pasta is made fresh in-house every morning.'
    },
    {
      category: 'Healthy',
      title: 'Wubeté Garden Harvest',
      desc: 'A vibrant medley of organic greens, roasted seeds, avocado, and a wild honey lemon zest.',
      price: '320 ETB',
      image: '/assets/menu/gourmet_garden_salad_premium_1775139525823.png',
      tag: 'Vibrant & Clean',
      info: 'Farm-to-Table • Vegan • Nutrient Rich',
      calories: '280 kcal',
      chefNote: 'All greens are picked from our on-site garden courtyard.'
    },
    {
      category: 'Beverages',
      title: 'Craft Honey Wine (Tej)',
      desc: 'Our award-winning traditional honey wine, matured in oak for a complex, floral finish.',
      price: '220 ETB',
      image: '/assets/menu/honey_wine_tej_premium_1775139571356.png',
      tag: 'Heritage Brew',
      info: 'Highland Honey • Floral • Potent',
      calories: '210 kcal',
      chefNote: 'Brewed using a secret 63-year-old family recipe.'
    },
    {
      category: 'Beverages',
      title: 'St. George Beer (330ml)',
      desc: 'Ethiopia’s oldest and most iconic premium lager with a crisp, refreshing finish.',
      price: '90 ETB',
      image: '/st_george.jpg',
      tag: 'Local Favorite',
      info: '330ml • Chilled • Lager',
      calories: '140 kcal',
      chefNote: 'Best enjoyed ice-cold overlooking the Rift Valley.'
    },
    {
      category: 'Beverages',
      title: 'Habesha Cold Gold (330ml)',
      desc: 'A rich and smooth golden lager known for its authentic Ethiopian brewing heritage.',
      price: '95 ETB',
      image: '/habesha_beer.jpg.webp',
      tag: 'Premium Brew',
      info: '330ml • Golden • Smooth',
      calories: '145 kcal',
      chefNote: 'Locally crafted, delivering a premium authentic taste.'
    },
    {
      category: 'Beverages',
      title: 'Harar Beer (330ml)',
      desc: 'A distinctively balanced brew from the historical region of Harar.',
      price: '85 ETB',
      image: '/harar_beer.jpg.jpg',
      tag: 'Heritage Brew',
      info: '330ml • Balanced • Crisp',
      calories: '135 kcal',
      chefNote: 'A distinct flavor profile straight from eastern Ethiopia.'
    },
    {
      category: 'Beverages',
      title: 'Bedele Beer (330ml)',
      desc: 'A bright, mildly hopped pilsner that offers a perfectly refreshing and light taste.',
      price: '85 ETB',
      image: '/bedele_beer.jpg',
      tag: 'Refreshing Choice',
      info: '330ml • Pilsner • Light',
      calories: '130 kcal',
      chefNote: 'An excellently easy-drinking local pilsner.'
    },
    {
      category: 'Beverages',
      title: 'Sen\'q Malt (330ml)',
      desc: 'A rich, dark and non-alcoholic malt beverage full of authentic energy.',
      price: '80 ETB',
      image: '/sen\'q malt.jpg',
      tag: 'Malt Boost',
      info: '330ml • Dark • Rich',
      calories: '180 kcal',
      chefNote: 'The favorite local malt alternative.'
    }
  ];

  const categories = [
    { name: 'Traditional', icon: Utensils },
    { name: 'International', icon: Star },
    { name: 'Beverages', icon: Wine },
    { name: 'Healthy', icon: Leaf }
  ];

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <Layout>
      <SEO
        title="Traditional Dining & Fine Cuisine"
        description="Savour authentic Ethiopian flavours and international gourmet cuisine at Wubeté Hotel's restaurant. Lake Chamo tilapia, Agelgil platters & daily coffee ceremony."
        path="/dining"
        image="https://wubetehotel.com/food_traditional_2.jpg"
      />
      {/* ── Cinematic Hero ── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 animate-[ken-burns_25s_ease-infinite_alternate] bg-[url(/assets/dining_hd.png)]"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-burgundy/30 to-brand-burgundy/80" />

        {/* Decorative Wave Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-10">
          <svg className="w-full h-16 text-[#fefaf0] fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,80 C480,120 960,0 1440,80 L1440,100 L0,100 Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6 fade-up">
              <span className="w-12 h-[2px] bg-brand-gold rounded-full"></span>
              <span className="text-brand-gold font-bold tracking-[0.4em] uppercase text-[10px]">
                {t('dining.hero.badge')}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white mb-6 leading-[0.9] tracking-tighter fade-up stagger-1 drop-shadow-2xl">
              {t('dining.hero.title').split(' ').map((word, i) => (
                <span key={i} className={`block ${i % 2 !== 0 ? 'italic font-extralight text-brand-gold/80' : ''}`}>
                  {word}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light leading-relaxed mb-8 fade-up stagger-2">
              {t('dining.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 fade-up stagger-3">
              <Link to="/contact?subject=Dining Reservation" className="btn-premium flex items-center justify-center gap-3">
                Secure a Table <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#menu" className="btn-premium-outline">
                The Heritage Menu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Culinary Journey ── */}
      <section className="py-24 bg-mesh relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 -skew-x-12 transform origin-top-right" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative fade-up group">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(45,17,21,0.3)] border-8 border-white">
                <img
                  src="/spacial_kurt.png"
                  alt="Traditional Plating"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy/90 via-transparent to-transparent opacity-40" />
              </div>

              {/* Overlapping Card */}
              <div className="absolute -bottom-16 -right-12 w-80 p-8 glass-card rounded-[2.5rem] border-white/40 shadow-2xl animate-[soft-float_8s_ease-infinite] hidden xl:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-brand-burgundy fill-brand-burgundy/20" />
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-brand-burgundy text-lg italic">Chef's Choice</h4>
                    <p className="text-[10px] text-brand-burgundy/60 uppercase tracking-widest font-black">Daily Selection</p>
                  </div>
                </div>
                <p className="text-sm text-brand-burgundy/70 italic leading-relaxed">
                  "Every dish is a canvas where we paint the flavors of our 63-year legacy."
                </p>
              </div>

              {/* Texture accent */}
              <div className="absolute top-20 -left-20 w-40 h-40 bg-brand-gold/10 rounded-full blur-[80px]" />
            </div>

            <div className="space-y-8 fade-up stagger-1">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-burgundy/5 rounded-full text-brand-burgundy font-black tracking-[0.3em] uppercase text-[9px] mb-4">
                  <MapPin className="w-3 h-3" /> {t('dining.philosophy.badge')}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
                  {t('dining.philosophy.title')}
                </h2>
                <div className="w-16 h-1 bg-brand-gold rounded-full mb-6"></div>
                <p className="text-lg text-gray-600 leading-relaxed font-light mb-6">
                  {t('dining.philosophy.desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="group">
                  <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-6 border border-brand-gold/10 group-hover:bg-brand-burgundy group-hover:scale-110 transition-all duration-500">
                    <Heart className="w-6 h-6 text-brand-burgundy group-hover:text-white" />
                  </div>
                  <h4 className="font-serif font-black text-xl mb-3 text-gray-900 italic">Organic Harvest</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-light">
                    Sourced from the mineral-rich volcanic valley soil, ensuring every bite is bursting with untamed flavor.
                  </p>
                </div>
                <div className="group">
                  <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-6 border border-brand-gold/10 group-hover:bg-brand-burgundy group-hover:scale-110 transition-all duration-500">
                    <Flame className="w-6 h-6 text-brand-burgundy group-hover:text-white" />
                  </div>
                  <h4 className="font-serif font-black text-xl mb-3 text-gray-900 italic">Mastered Heat</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-light">
                    Our ancient wood-fire techniques infuse a signature smokiness that has defined Wubeté for generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Culinary Highlights Explorer ── */}
      <section id="menu" className="py-24 bg-brand-burgundy relative overflow-hidden">
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-brand-gold opacity-[0.03] rounded-full blur-[150px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-white opacity-[0.02] rounded-full blur-[150px] translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
            <div className="fade-up lg:max-w-xl">
              <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-3 italic tracking-tighter leading-none">
                {t('dining.highlights.title')}
              </h2>
              <div className="w-12 h-0.5 bg-brand-gold mb-3"></div>
              <p className="text-white/60 font-light text-base italic">{t('dining.highlights.subtitle')}</p>
            </div>

            <div className="relative flex overflow-x-auto no-scrollbar bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-3xl fade-up stagger-1 max-w-full">
              <div className="flex min-w-max relative w-full">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex-1 px-5 py-2.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-2 relative z-10
                      ${activeCategory === cat.name ? 'text-brand-burgundy' : 'text-white/60 hover:text-white'}`}
                  >
                    <cat.icon className={`w-3.5 h-3.5 transition-transform duration-500 ${activeCategory === cat.name ? 'scale-125' : ''}`} />
                    {cat.name}
                  </button>
                ))}
                {/* Category Indicator */}
                <div
                  className={`absolute top-0 bottom-0 bg-brand-gold rounded-full transition-all duration-500 shadow-xl w-1/4 ${
                    activeCategory === 'Traditional' ? 'left-0' : 
                    activeCategory === 'International' ? 'left-[25%]' : 
                    activeCategory === 'Beverages' ? 'left-[50%]' : 'left-[75%]'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredItems.map((dish, i) => (
              <div key={i} className={`group animate-fade-in bg-white/5 rounded-[1.25rem] md:rounded-[1.5rem] p-2 md:p-3 border border-white/10 hover:bg-white/10 transition-all duration-500 shadow-xl hover:shadow-2xl flex flex-col h-full stagger-${i + 1}`}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 md:mb-4 shadow-inner bg-black/20 shrink-0">
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy/90 via-transparent to-transparent opacity-60" />

                  <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1.5 flex-wrap">
                    <div className="px-1.5 py-0.5 md:px-2 md:py-1 bg-brand-gold text-brand-burgundy rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-md">
                      {dish.tag}
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-black/50 backdrop-blur-xl rounded-lg border border-white/10 transform translate-y-2 md:translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <Info className="w-2.5 h-2.5 md:w-3 md:h-3 text-brand-gold" />
                    <span className="text-[7px] md:text-[8px] text-white font-bold tracking-widest uppercase truncate">{dish.info}</span>
                  </div>
                </div>

                <div className="px-1 flex flex-col flex-1">
                  <span className="text-brand-gold/80 font-bold text-[7px] md:text-[8px] uppercase tracking-[0.3em] block mb-1">{dish.category}</span>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-1.5 md:mb-2">
                    <h3 className="text-sm md:text-lg font-serif font-black text-white tracking-tighter leading-tight italic flex-1 truncate">{dish.title}</h3>
                    <span className="text-xs md:text-sm font-black text-brand-gold shrink-0">{dish.price}</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-white/60 font-light leading-relaxed mb-3 line-clamp-2 flex-1">
                    {dish.desc}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2.5 md:pt-3 border-t border-white/10 gap-2 mt-auto">
                    <p className="text-[8px] md:text-[10px] text-white/50 italic leading-snug flex-1 line-clamp-2">
                      <span className="text-brand-gold font-bold uppercase text-[7px] md:text-[8px] block mb-[1px] md:mb-0.5 not-italic tracking-widest">Chef's Note:</span>
                      "{dish.chefNote}"
                    </p>
                    <Link
                      to={`/contact?subject=Dining Inquiry: ${dish.title}`}
                      className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-full flex items-center justify-center text-brand-gold border border-brand-gold/20 transform group-hover:scale-105 transition-all duration-300 hover:bg-brand-gold hover:text-brand-burgundy shrink-0"
                    >
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coffee Ceremony Ritual ── */}
      <section className="py-20 relative overflow-hidden bg-[#0d0407] border-y border-brand-gold/10">
        <div className="absolute inset-0 ethiopian-pattern opacity-[0.03]" />
        <div className="absolute inset-0">
          <img 
            src="/traditional_food_detail.jpg" 
            className="w-full h-full object-cover opacity-10 scale-110 blur-[3px]" 
            alt="Coffee Legend" 
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0407]/90 to-[#0d0407]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 fade-up">
            <div className="tibeb-border mb-6 max-w-[150px] mx-auto rounded-full overflow-hidden" />
            <span className="text-brand-gold text-[9px] font-black tracking-[0.4em] uppercase mb-3 block">
              {t('dining.coffee.legend_kaldi')}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-5 tracking-tighter italic">
              {t('dining.coffee.title')}<span className="text-brand-gold">.</span>
            </h2>
            <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-light italic">
               "{t('dining.coffee.desc')}"
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
            {/* Step 1: Roasting */}
            <div className="fade-up mesob-card !bg-white/[0.02] backdrop-blur-3xl border-white/5 p-8 group hover:-translate-y-2 transition-all duration-700 rounded-[2rem]">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-[1.5rem] flex items-center justify-center mb-6 border border-brand-gold/20 group-hover:bg-brand-gold group-hover:rotate-12 transition-all shadow-xl">
                <Coffee className="w-8 h-8 text-brand-gold group-hover:text-brand-burgundy" />
              </div>
              <h3 className="text-white text-2xl font-serif font-bold mb-4">{t('dining.coffee.step1')}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-light">{t('dining.coffee.step1_desc')}</p>
              <div className="mt-8 flex items-center gap-3">
                <span className="text-brand-gold text-3xl font-serif italic">01</span>
                <div className="h-px flex-1 bg-brand-gold/20" />
                <span className="text-brand-gold/30 text-[10px] uppercase font-black tracking-widest">Ritual Start</span>
              </div>
            </div>

            {/* Step 2: Jebena */}
            <div className="fade-up stagger-1 mesob-card !bg-brand-gold/[0.03] backdrop-blur-3xl border-brand-gold/20 p-8 group hover:-translate-y-2 transition-all duration-700 rounded-[2rem] ring-1 ring-brand-gold/10">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-[1.5rem] flex items-center justify-center mb-6 border border-brand-gold/40 group-hover:bg-brand-gold group-hover:-rotate-12 transition-all shadow-xl">
                {/* Jebena Placeholder SVG Icon */}
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-brand-gold group-hover:fill-brand-burgundy transition-colors" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,2C10.34,2,9,3.34,9,5c0,1.1,0.6,2.06,1.5,2.58L8.21,11.83C7.4,12.43,7,13.39,7,14.4V19c0,1.66,1.34,3,3,3s3-1.34,3-3v-4.6 c0-1.01-0.4-1.97-1.21-2.57l-2.29-4.25C10.4,7.06,11,6.1,11,5C11,3.34,9.66,2,8,2z M17,11c-1.1,0-2,0.9-2,2s0.9,2,2,2c1.1,0,2-0.9,2-2 S18.1,11,17,11z" opacity=".8" />
                  <path d="M12,21c-4.41,0-8-3.59-8-8c0-2.39,1.05-4.53,2.72-6l1.47,1.33C6.88,9.51,6,11.16,6,13c0,3.31,2.69,6,6,6s6-2.69,6-6 c0-1.84-0.88-3.49-2.19-4.67l1.47-1.33C18.95,8.47,20,10.61,20,13C20,17.41,16.41,21,12,21z" />
                </svg>
              </div>
              <h3 className="text-white text-2xl font-serif font-bold mb-4">{t('dining.coffee.step2')}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-light">{t('dining.coffee.step2_desc')}</p>
              <div className="mt-8 flex items-center gap-3">
                <span className="text-brand-gold text-3xl font-serif italic">02</span>
                <div className="h-px flex-1 bg-brand-gold/20" />
                <span className="text-brand-gold/30 text-[10px] uppercase font-black tracking-widest">Golden Brew</span>
              </div>
            </div>

            {/* Step 3: Renewal */}
            <div className="fade-up stagger-2 mesob-card !bg-white/[0.02] backdrop-blur-3xl border-white/5 p-8 group hover:-translate-y-2 transition-all duration-700 rounded-[2rem]">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-[1.5rem] flex items-center justify-center mb-6 border border-brand-gold/20 group-hover:bg-brand-gold group-hover:rotate-12 transition-all shadow-xl">
                <Sparkles className="w-8 h-8 text-brand-gold group-hover:text-brand-burgundy" />
              </div>
              <h3 className="text-white text-2xl font-serif font-bold mb-4">{t('dining.coffee.step3')}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-light">{t('dining.coffee.step3_desc')}</p>
              <div className="mt-8 flex items-center gap-3">
                <span className="text-brand-gold text-3xl font-serif italic">03</span>
                <div className="h-px flex-1 bg-brand-gold/20" />
                <span className="text-brand-gold/30 text-[10px] uppercase font-black tracking-widest">Shared Grace</span>
              </div>
            </div>
          </div>

          {/* Bottom Experience Bar */}
          <div className="fade-up flex flex-col lg:flex-row items-center justify-between gap-10 p-12 bg-white/[0.03] rounded-[4rem] border border-white/10 backdrop-blur-3xl overflow-hidden relative group">
            <div className="absolute inset-0 ethiopian-pattern opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 bg-brand-burgundy rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
                <Clock className="w-8 h-8 text-brand-gold" />
              </div>
              <div>
                <span className="text-brand-gold text-[11px] font-black uppercase tracking-[0.5em] block mb-2">Daily Ritual</span>
                <span className="text-white font-bold text-2xl uppercase tracking-tighter italic">15:00 — 17:00</span>
              </div>
            </div>
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 bg-white shadow-2xl rounded-2xl flex items-center justify-center border border-brand-gold/10">
                <MapPin className="w-8 h-8 text-brand-burgundy" />
              </div>
              <div>
                <span className="text-brand-gold text-[11px] font-black uppercase tracking-[0.5em] block mb-2">Sanctuary</span>
                <span className="text-white font-bold text-2xl uppercase tracking-tighter italic">Garden Lounge</span>
              </div>
            </div>

            <div className="relative z-10">
              <button className="group/btn relative overflow-hidden px-12 py-5 bg-brand-gold text-brand-burgundy rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:shadow-[0_0_50px_rgba(196,164,132,0.4)] active:scale-95">
                <span className="relative z-10">Join the Legacy</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </div>
          <div className="tibeb-border mt-20 opacity-30" />
        </div>
      </section>

      {/* ── Dining Schedule ── */}
      <section className="py-24 bg-mesh">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { time: '06:30 - 10:30', title: 'The Sunrise Breakfast', icon: Clock, desc: 'A curated spread of continental delicatessen and heritage Ethiopian morning staples.', color: 'bg-orange-50/50' },
              { time: '12:00 - 15:30', title: 'The Rift Valley Lunch', icon: Utensils, desc: 'Experience the day\'s freshest catch and organic salads overlooking the national park.', color: 'bg-green-50/50' },
              { time: '18:30 - 22:30', title: 'Star-lit Fine Dining', icon: Wine, desc: 'A sophisticated candle-lit fusion of global gourmet standards and Arba Minch spice.', color: 'bg-blue-50/50' }
            ].map((item, i) => (
              <div key={i} className="premium-card !rounded-[2.5rem] p-8 group flex flex-col items-center text-center relative overflow-hidden">
                <div className={`w-16 h-16 rounded-[1.5rem] ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <item.icon className="w-8 h-8 text-brand-burgundy" />
                </div>
                <h4 className="text-2xl font-serif font-black mb-4 text-gray-900 group-hover:text-brand-burgundy transition-colors">{item.title}</h4>
                <div className="px-6 py-2 bg-brand-burgundy text-brand-gold rounded-full mb-6 shadow-inner shadow-black/10">
                  <span className="font-black tracking-[0.2em] text-[9px] uppercase">{item.time}</span>
                </div>
                <p className="text-base text-gray-400 font-light leading-relaxed italic">
                  "{item.desc}"
                </p>
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Signature CTA ── */}
      <section className="py-24 relative bg-brand-gold/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center fade-up relative z-10">
          <span className="text-brand-burgundy font-black tracking-[0.5em] uppercase text-[9px] mb-6 block opacity-50">Reserve Your Table</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-brand-burgundy mb-8 italic tracking-tighter leading-tight">Elevate Your Stay <br />With Unforgettable Flavor</h2>
          <p className="text-lg md:text-xl text-brand-burgundy/60 font-light mb-10 max-w-2xl mx-auto italic leading-relaxed">
            From intimate lakeside dinners to lively traditional feasts, Wubeté offers the definitive Arba Minch gastronomic journey.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/contact?subject=Dining Experience Inquiry" className="btn-premium">
              Book An Experience
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// Trigger HMR
