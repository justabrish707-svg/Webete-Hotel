import { CheckCircle2, Calendar, Users, MapPin, Smartphone, User, Home, Receipt } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StayPassProps {
  formData: {
    guest_name: string;
    check_in: string;
    check_out: string;
    guests: number;
    room_type: string;
  };
  amount: number;
  roomLabel?: string;
}

export default function StayPass({ formData, amount, roomLabel }: StayPassProps) {
  const { t } = useTranslation();
  const checkIn = new Date(formData.check_in).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const checkOut = new Date(formData.check_out).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  
  return (
    <div className="mx-auto max-w-md animate-fade-up">
      {/* ── PASS OUTER CONTAINER ── */}
      <div className="relative bg-white rounded-3xl shadow-[0_30px_90px_-20px_rgba(45,17,21,0.25)] overflow-hidden border border-gray-100 border-t-brand-gold border-t-8">
        
        {/* ── Header ── */}
        <div className="bg-brand-burgundy p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-10 h-10 bg-brand-gold/10 rounded-full blur-3xl -mr-10 -mt-5" />
          <div className="absolute bottom-0 left-0 w-10 h-10 bg-white/5 rounded-full blur-2xl -ml-10 -mb-5" />
          
          <div className="w-8 h-8 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3">
            <img src="/logo_mark.jpg" alt="Logo" className="w-8 h-8 rounded-xl" />
          </div>
          
          <div className="inline-flex items-center gap-2 bg-brand-gold/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-4 border border-brand-gold/30">
            <CheckCircle2 className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-gold text-[10px] font-black tracking-widest uppercase">{t('booking.pass_confirmed')}</span>
          </div>
          
          <h2 className="text-white text-3xl font-serif font-bold italic tracking-tighter leading-none">
            {t('booking.pass_title')}
          </h2>
          <p className="text-white/60 text-[10px] font-bold tracking-[0.4em] uppercase mt-4">Arba Minch, Ethiopia</p>
        </div>

        {/* ── Body ── */}
        <div className="p-6 space-y-8 bg-[radial-gradient(circle_at_top,white,rgba(196,164,132,0.05)_100%)]">
          
          {/* Guest Name Section */}
          <div className="flex items-center gap-5 border-b border-gray-50 pb-6">
            <div className="w-12 h-12 bg-brand-cream rounded-2xl flex items-center justify-center text-brand-burgundy shadow-sm shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">{t('booking.pass_lead_guest')}</p>
              <h3 className="text-xl font-bold text-gray-900 leading-none">{formData.guest_name}</h3>
            </div>
          </div>

          {/* Dates & Guests Row */}
          <div className="grid grid-cols-2 gap-8 border-b border-gray-50 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('booking.pass_dates')}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {checkIn} - <br /> {checkOut}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('booking.pass_party_size')}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {formData.guests} {formData.guests === 1 ? (t('booking.guest') || 'Guest') : (t('booking.guests_plural') || 'Guests')}
              </p>
            </div>
          </div>

          {/* Room Row */}
          <div className="grid grid-cols-2 gap-8 border-b border-gray-50 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('booking.pass_accommodation')}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight text-brand-burgundy">
                {roomLabel}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('booking.pass_total')}</span>
              </div>
              <p className="text-sm font-black text-brand-burgundy leading-tight">
                {amount.toLocaleString()} ETB
              </p>
            </div>
          </div>

          {/* Location & Contact Info */}
          <div className="pt-2">
             <div className="flex items-start gap-4 mb-4">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-1" />
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed italic">
                  Sile Zerihun, Arba Minch. Located directly across from Lake Chamo Safari entrance.
                </p>
             </div>
          </div>

          {/* Screenshot Tip */}
          <div className="bg-brand-burgundy/5 p-6 rounded-3xl border border-brand-gold/10 flex items-center gap-4 text-brand-burgundy shadow-inner">
             <div className="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center shrink-0">
               <Smartphone className="w-4 h-4 text-brand-burgundy" />
             </div>
             <p className="text-xs font-bold leading-relaxed italic">
               {t('booking.pass_screenshot')}
             </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="bg-gray-50/50 p-5 text-center border-t border-gray-100 flex flex-col items-center">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4">{t('booking.pass_footer')}</p>
           <button 
             onClick={() => window.print()}
             className="text-brand-burgundy text-[10px] font-black uppercase tracking-widest hover:text-brand-gold transition-colors flex items-center gap-2"
           >
             {t('booking.pass_print')}
           </button>
        </div>

        {/* ── Decorative Punched Holes ── */}
        <div className="absolute top-[35%] -left-4 w-8 h-8 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />
        <div className="absolute top-[35%] -right-4 w-8 h-8 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />
      </div>
    </div>
  );
}
