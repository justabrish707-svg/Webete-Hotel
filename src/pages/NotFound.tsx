import { Compass, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-burgundy flex items-center justify-center relative overflow-hidden px-6">
      {/* ── Background Accents ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 transform origin-top-right" />
        {/* Artistic Compass Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100" y2="100" stroke="white" strokeWidth="0.1" />
            <line x1="0" y1="100" x2="100" y2="0" stroke="white" strokeWidth="0.1" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.1" />
          </svg>
        </div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10 fade-up">
        <div className="w-32 h-32 bg-brand-gold/10 backdrop-blur-2xl rounded-full flex items-center justify-center mx-auto mb-10 border border-brand-gold/20 shadow-2xl">
          <Compass className="w-16 h-16 text-brand-gold animate-[spin_10s_linear_infinite]" />
        </div>
        
        <span className="text-brand-gold font-black tracking-[0.8em] uppercase text-xs mb-6 block opacity-60">Error 404</span>
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 italic tracking-tighter leading-none">
          Lost in the <br /><span className="text-brand-gold">Rift Valley</span>
        </h1>
        
        <p className="text-xl text-white/50 font-light mb-12 max-w-lg mx-auto italic leading-relaxed">
          It seems you've wandered off the trail. Even the most seasoned explorers occasionally lose their way in our vast landscape.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/"
            className="group flex items-center gap-4 px-10 py-5 bg-brand-gold text-brand-burgundy rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-2xl transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sanctuary
          </Link>
          <Link
            to="/contact"
            className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-white/20 transition-all font-sans"
          >
            Report a Detour
          </Link>
        </div>
      </div>

      {/* ── Decorative Footer ── */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center fade-up stagger-1">
         <div className="flex items-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
            <span>Legacy</span>
            <div className="w-1 h-1 bg-brand-gold rounded-full" />
            <span>ESTD 1962</span>
            <div className="w-1 h-1 bg-brand-gold rounded-full" />
            <span>Luxury</span>
         </div>
      </div>
    </div>
  );
}
