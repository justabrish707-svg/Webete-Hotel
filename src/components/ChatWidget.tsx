import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, MessageSquare } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const whatsappNumber = '251954897133';
  const telegramUsername = 'wubetehotel'; // Adjust if they have a specific username

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed right-6 top-[60%] -translate-y-1/2 z-[9999] flex flex-col items-end gap-4 pointer-events-none group">
      {/* ── ChatBubble/Notification ── */}
      {showNotification && !isOpen && (
        <div className="bg-white/95 backdrop-blur-2xl p-5 rounded-[2rem] shadow-[0_30px_70px_rgba(45,17,21,0.25)] border border-brand-gold/30 mb-2 pointer-events-auto animate-fade-up max-w-[260px] relative">
          <button 
            onClick={() => setShowNotification(false)}
            className="absolute -top-3 -right-3 bg-brand-burgundy p-2 rounded-full text-brand-gold hover:bg-brand-gold hover:text-brand-burgundy transition-all shadow-xl border border-white/20"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-burgundy flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden group/icon">
              <div className="absolute inset-0 bg-brand-gold opacity-0 group-hover/icon:opacity-20 transition-opacity" />
              <MessageSquare className="w-6 h-6 text-brand-gold relative z-10" />
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-burgundy/40 uppercase tracking-[0.2em] mb-1">Concierge</p>
              <p className="text-[12px] font-bold text-gray-900 leading-tight">
                Welcome! How may we serve you today?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Chat Modal ── */}
      {isOpen && (
        <div className="bg-white/98 backdrop-blur-xl w-[360px] rounded-[3rem] shadow-[0_40px_120px_rgba(13,4,7,0.4)] border border-white/40 overflow-hidden pointer-events-auto animate-fade-up origin-right">
          <div className="bg-brand-burgundy p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/15 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/30 rounded-full blur-3xl -ml-20 -mb-20" />
            
            <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-md border border-white/20 relative group/logo">
              <div className="absolute inset-0 bg-brand-gold/20 rounded-[2rem] animate-ping opacity-20" />
              <img src="/logo_mark.jpg" alt="Hotel Logo" className="w-16 h-16 rounded-[1.5rem] relative z-10 p-1" />
            </div>
            
            <h3 className="text-white text-2xl font-serif font-black tracking-tight">Wubeté Concierge</h3>
            <p className="text-brand-gold/60 text-[10px] font-black tracking-[0.4em] uppercase mt-2">Personal Service Since 1963</p>
          </div>

          <div className="p-10 space-y-5 bg-gray-50/30">
            <div className="grid grid-cols-1 gap-4">
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 p-5 bg-white rounded-3xl border border-gray-100/50 hover:border-green-500/30 hover:shadow-[0_20px_40px_rgba(34,197,94,0.1)] transition-all duration-500 group/wa"
              >
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-black text-gray-900 block text-sm uppercase tracking-wider mb-0.5">WhatsApp</span>
                  <span className="text-[11px] text-gray-400 font-medium">Connect immediately</span>
                </div>
              </a>

              <a 
                href={`https://t.me/${telegramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 p-5 bg-white rounded-3xl border border-gray-100/50 hover:border-blue-500/30 hover:shadow-[0_20px_40px_rgba(0,136,204,0.1)] transition-all duration-500 group/tg"
              >
                <div className="w-14 h-14 bg-[#0088cc] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-black text-gray-900 block text-sm uppercase tracking-wider mb-0.5">Telegram</span>
                  <span className="text-[11px] text-gray-400 font-medium">Guest Services</span>
                </div>
              </a>

              <a
                href={`tel:${import.meta.env.VITE_HOTEL_PHONE || '+251954897133'}`}
                className="flex items-center gap-5 p-5 bg-white rounded-3xl border border-gray-100/50 hover:border-brand-gold/30 hover:shadow-[0_20px_40px_rgba(196,164,132,0.15)] transition-all duration-500 group/ph"
              >
                <div className="w-14 h-14 bg-brand-burgundy rounded-2xl flex items-center justify-center shadow-lg shadow-brand-burgundy/20 group-hover:scale-110 transition-all duration-500">
                  <Phone className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <span className="font-black text-gray-900 block text-sm uppercase tracking-wider mb-0.5">Direct Line</span>
                  <span className="text-[11px] text-gray-400 font-medium">Available 24/7/365</span>
                </div>
              </a>
            </div>
          </div>

          <div className="p-5 bg-white border-t border-gray-50 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Modern Luxury Arba Minch</p>
          </div>
        </div>
      )}

      {/* ── Floating Action Element ── */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowNotification(false);
        }}
        className="pointer-events-auto flex items-center gap-3 pl-6 pr-4 py-3 bg-brand-burgundy text-brand-gold rounded-l-full shadow-lg transform active:scale-95 transition-all duration-500 border border-brand-gold/20 backdrop-blur-lg group relative translate-x-4 hover:translate-x-0"
      >
        <div className="absolute inset-0 bg-brand-gold opacity-0 group-hover:opacity-10 transition-opacity" />
        
        {isOpen ? (
          <>
            <span className="font-black text-[9px] uppercase tracking-[0.2em] relative z-10">Close</span>
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center relative z-10">
              <X className="w-4 h-4 animate-in zoom-in duration-300" />
            </div>
          </>
        ) : (
          <>
            <span className="font-black text-[9px] uppercase tracking-[0.2em] relative z-10">Concierge</span>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-500">
              <MessageCircle className="w-5 h-5 animate-in zoom-in duration-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-gold rounded-full border border-brand-burgundy animate-pulse" />
            </div>
          </>
        )}
      </button>
    </div>
  );
}
