import { Link } from 'react-router-dom';
import { Wifi, Car, Coffee, Utensils, MapPin, Star, ArrowRight, Shield, Award, Users } from 'lucide-react';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import BookingWidget from '../components/BookingWidget';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Home() {
  const { t } = useTranslation();
  useScrollReveal();
  
  useEffect(() => {
    document.title = "Wubeté Hotel Arba Minch | 63 Years of Modern Luxury";
    
    // Load TikTok embed script dynamically
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const highlights = [
    { icon: Wifi, title: t('home.highlights.wifi'), description: t('home.highlights.wifi_desc') },
    { icon: Car, title: t('home.highlights.parking'), description: t('home.highlights.parking_desc') },
    { icon: Coffee, title: t('home.highlights.coffee'), description: t('home.highlights.coffee_desc') },
    { icon: Utensils, title: t('home.highlights.dining'), description: t('home.highlights.dining_desc') },
    { icon: MapPin, title: t('home.highlights.tour'), description: t('home.highlights.tour_desc') },
    { icon: Shield, title: t('home.highlights.security'), description: t('home.highlights.security_desc') },
  ];

  const rooms = [
    {
      name: t('home.rooms.standard'),
      price: '1,500',
      image: '/webete_bedroom_1.jpg',
      description: t('home.rooms.standard_desc'),
      badge: 'Highly Rated',
    },
    {
      name: t('home.rooms.deluxe'),
      price: '2,150',
      image: '/deluxe_room_2.webp',
      description: t('home.rooms.deluxe_desc'),
      badge: 'Best Value',
    },
    {
      name: t('home.rooms.executive'),
      price: '3,450',
      image: '/webete_bedroom_3.jpg',
      description: t('home.rooms.executive_desc'),
      badge: 'Honeymoon Choice',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'United Kingdom',
      rating: 5,
      text: 'Absolutely stunning hotel with breathtaking views of Lake Chamo. The staff went above and beyond to make our stay memorable.',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      location: 'Singapore',
      rating: 5,
      text: 'The perfect blend of luxury and authentic Ethiopian hospitality. The coffee ceremony was a highlight of our entire trip.',
      avatar: 'MC',
    },
    {
      name: 'Emma Williams',
      location: 'Australia',
      rating: 5,
      text: 'Beautiful rooms, excellent service, and the location is perfect for exploring Nechisar National Park. Highly recommend!',
      avatar: 'EW',
    },
  ];

  const stats = [
    { value: '500+', label: t('home.stats.guests'), icon: Users },
    { value: '4.9', label: t('home.stats.rating'), icon: Star },
    { value: '63', label: t('home.stats.years'), icon: Award },
    { value: '24/7', label: t('home.stats.support'), icon: Shield },
  ];

  const experiences = [
    {
      title: t('home.exp.lake'),
      desc: t('home.exp.lake_desc'),
      image: '/hippo_chamo.jpg',
    },
    {
      title: t('home.exp.park'),
      desc: t('home.exp.park_desc'),
      image: '/nechisar_zebra_1.png',
    },
    {
      title: t('home.exp.dorze'),
      desc: t('home.exp.dorze_desc'),
      image: '/dorze_1.png',
    },
  ];

  return (
    <Layout>
      <SEO
        title="63 Years of Modern Luxury"
        description="Experience luxury hospitality at Arba Minch Wubeté Hotel. Breathtaking Lake Chamo views, premium suites, authentic Ethiopian dining & curated safari adventures."
        path="/"
      />
      {/* ── Hero ── */}
      <section className="relative h-[60vh] min-h-[380px] overflow-hidden cls-box">
        {/* ── Cinematic Video Background ── */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
            poster="/assets/hero_hd.png"
          >
            <source src="/hero_video.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-[#0d0407]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy/40 via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-5xl">
            <div className="hero-badge mb-6 fade-up stagger-1">
              <span className="w-12 h-[1px] bg-brand-gold/50" />
              <span className="font-sans font-bold text-xs tracking-[0.3em] text-brand-gold/90 uppercase">Arba Minch Wubeté</span>
              <span className="w-12 h-[1px] bg-brand-gold/50" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1] tracking-tight fade-up stagger-2 drop-shadow-2xl">
              {t('hero.title')}<span className="text-brand-gold">.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed fade-up stagger-3">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-up stagger-3">
              <Link
                to="/booking"
                className="btn-premium !px-12 !py-5"
              >
                {t('nav.book')}
              </Link>
              <Link
                to="/rooms"
                className="btn-premium-outline !px-12 !py-5"
              >
                Explore Sanctuary
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-brand-gold/80 to-transparent" />
          <span className="text-brand-gold/50 text-[9px] uppercase tracking-[0.4em] font-black">Discover</span>
        </div>
      </section>

      {/* ── Booking Widget Overlay ── */}
      <section className="py-0 -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-12">
          <div className="glass-card rounded-[2.5rem] p-4 shadow-2xl overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(45,17,21,0.2)] transition-shadow duration-700">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section id="highlights" className="py-12 bg-mesh">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 fade-up">
            <p className="text-[#2d1115]/60 text-xs font-black tracking-[0.4em] uppercase mb-3">Refined Comfort</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
              Curated Amenities
            </h2>
            <div className="w-16 h-1 bg-brand-gold/50 rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="fade-up premium-card p-5 text-center flex flex-col items-center group"
              >
                <div className="w-12 h-12 bg-brand-gold/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-gold transition-all duration-300">
                  <highlight.icon className="w-5 h-5 text-brand-burgundy group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-brand-burgundy transition-colors">{highlight.title}</h3>
                <p className="text-[11px] text-gray-500 leading-tight font-medium opacity-80">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8 fade-up">
            <div>
              <p className="text-brand-burgundy/60 text-xs font-black tracking-[0.4em] uppercase mb-2">Our Sanctuary</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight tracking-tight">
                Luxury Suites
              </h2>
            </div>
            <Link
              to="/rooms"
              className="text-brand-burgundy font-black text-xs uppercase tracking-widest hover:text-brand-gold transition-colors flex items-center gap-2 group"
            >
              All Rooms <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="fade-up premium-card overflow-hidden group flex flex-col"
              >
                <div className="relative h-56 overflow-hidden cls-box aspect-card">
                  <img
                    src={room.image}
                    alt={room.name}
                    loading="lazy"
                    className="w-full h-full object-cover img-enhance"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-brand-burgundy text-[9px] font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-sm">
                      {room.badge}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-xl font-serif font-black text-gray-900 uppercase tracking-tight">{room.name}</h3>
                    <div className="text-right">
                      <span className="text-lg font-black text-brand-burgundy leading-none block">{room.price}</span>
                      <span className="text-gray-400 text-[8px] uppercase font-bold tracking-widest">ETB / Night</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6 flex-1 line-clamp-2">{room.description}</p>
                  <Link
                    to="/rooms"
                    className="flex items-center justify-center gap-3 w-full bg-gray-50 group-hover:bg-brand-burgundy group-hover:text-white py-3 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest"
                  >
                    Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience Arbaminch ── */}
      <section className="py-12 bg-[#1a0a0c] relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-brand-gold/10 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8 text-white fade-up">
            <span className="text-brand-gold text-[10px] font-black tracking-[0.4em] uppercase mb-2 block">Curated Journeys</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 tracking-tight italic">
              Experience Nature
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.map((exp, index) => (
              <div key={index} className="fade-up relative h-[280px] rounded-2xl overflow-hidden group border border-white/5 shadow-2xl">
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-xl font-serif font-bold text-brand-gold mb-1">{exp.title}</h3>
                  <p className="text-xs text-white/70 font-medium line-clamp-2 leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/activities"
              className="inline-flex items-center gap-3 bg-brand-gold text-brand-burgundy px-6 py-3 rounded-full hover:bg-white transition-all font-black uppercase text-xs tracking-widest shadow-xl"
            >
              Explore All Adventures <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 fade-up">
            <p className="text-brand-burgundy/60 text-xs font-black tracking-[0.4em] uppercase mb-2">Guest Feedback</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Unforgettable Stays
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="fade-up premium-card p-6 flex flex-col group relative">
                <div className="text-4xl font-serif text-brand-gold/20 absolute top-4 right-6 group-hover:text-brand-gold/40 transition-colors">"</div>
                <p className="text-gray-600 mb-6 leading-relaxed font-medium italic text-sm relative z-10 flex-1">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-burgundy rounded-xl flex items-center justify-center text-brand-gold font-black text-sm shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-black text-brand-burgundy text-xs uppercase tracking-wider">{testimonial.name}</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section className="py-10 bg-brand-burgundy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,164,132,0.08)_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="fade-up group py-3">
                <div className="text-3xl md:text-4xl font-serif font-bold text-white mb-1 tracking-tighter group-hover:text-brand-gold transition-colors duration-300">{stat.value}</div>
                <div className="w-8 h-px bg-brand-gold/30 mx-auto mb-2 group-hover:w-16 transition-all duration-500" />
                <div className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-12 bg-mesh">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8 fade-up">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">
              Guest Intelligence
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "What are the check-in and check-out times?", a: "Standard check-in is at 2:00 PM, and check-out is at 11:00 AM." },
              { q: "Do you provide airport shuttle service?", a: "Yes! We offer a complimentary shuttle for all guests from Arba Minch Airport." },
              { q: "Is breakfast included in the room rate?", a: "Most suites include our full traditional and international breakfast buffet." }
            ].map((faq, i) => (
              <div key={i} className="fade-up bg-white rounded-2xl border border-gray-100 p-4 shadow-sm group">
                <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-3">
                  <span className="w-6 h-6 bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-burgundy text-[10px] font-black">?</span>
                  {faq.q}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed pl-9 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Media Wall ── */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center fade-up">
          <p className="text-brand-burgundy/60 text-xs font-black tracking-[0.4em] uppercase mb-4">Connect With Us</p>
          <div className="flex justify-center w-full">
            <blockquote
              className="tiktok-embed"
              cite="https://www.tiktok.com/@wubetehotel.arbaminch"
              data-unique-id="wubetehotel.arbaminch"
              data-embed-type="creator"
              style={{ maxWidth: '600px', minWidth: '288px' }}
            >
              <section>
                <a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@wubetehotel.arbaminch?refer=creator_embed">@wubetehotel.arbaminch</a>
              </section>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-20 bg-[#0d0407] overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,164,132,0.1)_0%,transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <p className="text-brand-gold/60 text-[10px] font-black tracking-[0.5em] uppercase mb-6">Your Next Chapter</p>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
            Your Luxury Story <span className="text-shiny italic">Awaits</span>
          </h2>
          <p className="text-white/50 font-medium mb-10 max-w-xl mx-auto leading-relaxed">Reserve your sanctuary at Africa's most extraordinary lakeside retreat.</p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-3 bg-brand-gold text-brand-burgundy px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.15em] hover:bg-white transition-all duration-500 shadow-[0_0_40px_rgba(196,164,132,0.3)] hover:shadow-[0_0_60px_rgba(196,164,132,0.5)] hover:-translate-y-1 active:scale-95"
          >
            Secure Your Suite <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
