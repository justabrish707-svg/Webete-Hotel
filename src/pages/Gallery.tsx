import { Camera, X } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Gallery() {
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  useScrollReveal(activeCategory);

  const galleryCategories = [
    { id: 'rooms',   label: t('gallery.cat_rooms') },
    { id: 'dining',  label: t('gallery.cat_dining') },
    { id: 'nature',  label: t('gallery.cat_nature') },
    { id: 'culture', label: t('gallery.cat_culture') },
  ];

  const images = [
    { src: '/webete_bedroom_1.jpg',           category: 'rooms',   title: 'Legacy Standard' },
    { src: '/deluxe_room_2.webp',             category: 'rooms',   title: 'Deluxe Lake View' },
    { src: '/webete_bedroom_3.jpg',           category: 'rooms',   title: 'Executive Retreat' },
    { src: '/assets/dining_hd.png',           category: 'dining',  title: 'Grand Dining' },
    { src: '/spacial_kurt.png',               category: 'dining',  title: 'Chef Special' },
    { src: '/traditional_food_detail_1.png',  category: 'dining',  title: 'Traditional Detail' },
    { src: '/grilled-fish.jpg',               category: 'dining',  title: 'Lake Catch' },
    { src: '/food_traditional_2.jpg',         category: 'dining',  title: 'Authentic Platter' },
    { src: '/assets/nature_safari_hd.png',    category: 'nature',  title: 'Rift Valley Safari' },
    { src: '/nechisar_park_1.jpg',            category: 'nature',  title: 'Nechisar Plains' },
    { src: '/hippo_chamo.jpg',                category: 'nature',  title: 'River Safari' },
    { src: '/lake_chamo_crocodile.jpg',       category: 'nature',  title: 'Wild Encounter' },
    { src: '/nechisar_zebra_1.png',           category: 'nature',  title: 'Savannah Life' },
    { src: '/dorze_village_1_1.png',          category: 'culture', title: 'Village Life' },
    { src: '/dorze_children.jpg',             category: 'culture', title: 'Local Smiles' },
    { src: '/dorze_1.png',                    category: 'culture', title: 'Ancestral Roots' },
    { src: '/building_night_1.png',           category: 'culture', title: 'Wubeté at Night' },
  ];

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory);

  return (
    <Layout>
      <SEO
        title="Photo Gallery"
        description="Browse stunning photography of Arba Minch Wubeté Hotel — luxury suites, authentic Ethiopian cuisine, Lake Chamo safari scenes, and local culture."
        path="/gallery"
        image="https://wubetehotel.com/hippo_chamo.jpg"
      />
      {/* ── Cinematic Hero ── */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img
            src="/assets/nature_safari_hd.png"
            alt="Gallery Hero"
            className="w-full h-full object-cover scale-105 animate-[ken-burns_25s_ease-infinite_alternate]"
          />
        </div>
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
                <Camera className="w-4 h-4" /> Visual Journey
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-white mb-8 italic tracking-tighter leading-[0.85] drop-shadow-2xl">
              {t('nav.gallery')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed fade-up stagger-3">
              A curated visual journey through Arba Minch's most beloved luxury sanctuary.
            </p>
          </div>
        </div>
      </section>

      {/* ── Masonry Gallery ── */}
      <section className="py-24 bg-mesh min-h-screen">
        <div className="max-w-7xl mx-auto px-6">

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16 fade-up stagger-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-brand-burgundy text-white shadow-xl'
                  : 'bg-white/80 backdrop-blur-md text-gray-500 hover:text-brand-burgundy border border-white/20 shadow-sm'
              }`}
            >
              All
            </button>
            {galleryCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-brand-burgundy text-white shadow-xl'
                    : 'bg-white/80 backdrop-blur-md text-gray-500 hover:text-brand-burgundy border border-white/20 shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div
            key={activeCategory}
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 animate-fade-in"
          >
            {filteredImages.map((img, index) => (
              <div
                key={`${img.src}-${index}`}
                onClick={() => { setSelectedImage(img.src); setSelectedTitle(img.title); }}
                className="fade-up relative group break-inside-avoid overflow-hidden cursor-pointer rounded-2xl shadow-lg border-4 border-white/50"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                  <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2">{img.category}</span>
                  <h3 className="text-2xl font-serif font-black italic text-white leading-tight">{img.title}</h3>
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
          <span className="text-brand-burgundy font-black tracking-[0.6em] uppercase text-[10px] mb-8 block opacity-50">Imagine Yourself Here</span>
          <h2 className="text-5xl md:text-7xl font-serif font-black text-brand-burgundy mb-12 italic tracking-tighter leading-tight">
            Create Your Own <span className="text-brand-gold">Mementos</span>
          </h2>
          <div className="flex justify-center">
            <Link
              to="/booking"
              className="btn-premium"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0407]/97 backdrop-blur-2xl p-4 animate-fade-in"
          onClick={() => setSelectedImage(undefined)}
        >
          <button
            className="absolute top-6 right-6 w-8 h-8 bg-white/10 hover:bg-brand-gold rounded-full flex items-center justify-center text-white transition-all z-[110]"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(undefined); }}
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt={selectedTitle || 'Gallery'}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            {selectedTitle && (
              <div className="mt-6 text-center">
                <h4 className="text-brand-gold text-xl font-serif italic font-bold">{selectedTitle}</h4>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
