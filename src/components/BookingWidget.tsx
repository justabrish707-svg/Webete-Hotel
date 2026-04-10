import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHotelStore } from '../store/useHotelStore';
import { Calendar, Users, BedDouble, ArrowRight, Sparkles } from 'lucide-react';

export default function BookingWidget() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const rooms = useHotelStore(state => state.rooms);

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: rooms[0]?.id || 'standard_room',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/booking', { state: formData });
  };

  const inputClass =
    'w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/50 focus:bg-[#fffdf8] transition-all cursor-pointer font-medium text-gray-800 placeholder:text-gray-400 shadow-sm';

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(45,17,21,0.12)] border border-gray-100 relative overflow-hidden">
      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-burgundy via-brand-gold to-brand-burgundy" />

      <div className="p-6 md:p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-brand-gold/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-gold" />
          </div>
          <div>
            <p className="text-[10px] font-black text-brand-burgundy uppercase tracking-[0.3em]">
              {t('nav.book_now')}
            </p>
            <p className="text-xs text-gray-400 font-medium">Best rates guaranteed · Instant confirmation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Check In */}
          <div className="lg:col-span-1">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              <Calendar className="w-3 h-3 text-brand-gold" />
              {t('booking.check_in')}
            </label>
            <input
              type="date"
              id="widget-checkin"
              value={formData.checkIn}
              onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
              required
              min={today}
              className={inputClass}
            />
          </div>

          {/* Check Out */}
          <div className="lg:col-span-1">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              <Calendar className="w-3 h-3 text-brand-gold" />
              {t('booking.check_out')}
            </label>
            <input
              type="date"
              id="widget-checkout"
              value={formData.checkOut}
              onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
              required
              min={formData.checkIn || today}
              className={inputClass}
            />
          </div>

          {/* Guests */}
          <div className="lg:col-span-1">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              <Users className="w-3 h-3 text-brand-gold" />
              {t('booking.guests')}
            </label>
            <select
              id="widget-guests"
              value={formData.guests}
              onChange={e => setFormData({ ...formData, guests: e.target.value })}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? t('booking.guest') : t('booking.guests_plural')}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          <div className="lg:col-span-1">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              <BedDouble className="w-3 h-3 text-brand-gold" />
              {t('booking.room_type')}
            </label>
            <select
              id="widget-room-type"
              value={formData.roomType}
              onChange={e => setFormData({ ...formData, roomType: e.target.value })}
              className={inputClass}
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id} disabled={!room.available}>
                  {room.name}{!room.available ? ` (${t('booking.sold_out')})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* CTA Button */}
          <div className="lg:col-span-1 flex items-end">
            <button
              type="submit"
              id="widget-check-availability"
              className="btn-shimmer w-full bg-brand-burgundy text-brand-gold px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(45,17,21,0.2)] hover:bg-brand-gold hover:text-brand-burgundy hover:shadow-[0_10px_30px_rgba(196,164,132,0.3)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {t('nav.book_now')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer hint */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[10px] text-gray-400 font-black uppercase tracking-widest border-t border-gray-50 pt-5">
          <span className="flex items-center gap-1.5">✓ Free cancellation</span>
          <span className="flex items-center gap-1.5">✓ No hidden fees</span>
          <span className="flex items-center gap-1.5">✓ 24/7 support</span>
        </div>
      </div>
    </div>
  );
}
