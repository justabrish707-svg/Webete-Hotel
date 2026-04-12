import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Users, DoorOpen, ArrowRight, CheckCircle2, Phone, Clock, CreditCard, X, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useHotelStore } from '../store/useHotelStore';
import { createBookingAndNotify } from '../utils/notifications';
import { initializeChapaPayment, generateTxRef } from '../utils/chapa';
import StayPass from '../components/StayPass';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import confetti from 'canvas-confetti';

export default function Booking() {
  const [searchParams] = useSearchParams();

  // Helper to map general URL types to specific room inventory IDs
  const getInitialRoom = (params: URLSearchParams) => {
    const r = params.get('room');
    if (r === 'standard') return '101';
    if (r === 'deluxe') return '201';
    if (r === 'executive') return '202';
    if (r === 'family') return '301';
    return r || '101';
  };

  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    guest_name: '',
    email: '',
    phone: '',
    check_in: '',
    check_out: '',
    room_type: getInitialRoom(searchParams),
    guests: 1,
    special_requests: '',
  });

  // Automatically update selected room if URL changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, room_type: getInitialRoom(searchParams) }));
  }, [searchParams]);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showPayment, setShowPayment] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState({ dailyRate: 0, nights: 0, subtotal: 0, serviceCharge: 0, vat: 0, total: 0 });
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (status === 'success') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#2D1115', '#ffffff']
      });
    }
  }, [status]);

  const { rooms, isLockdownActive } = useHotelStore();

  const roomTypes = rooms.map(r => ({
    value: r.id,
    label: r.name,
    price: r.price,
    capacity: r.capacity,
    available: r.available,
    image: r.image
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value,
    }));
  };

  const handleDateChange = (name: 'check_in' | 'check_out', date: Date | null) => {
    if (date) {
      const localString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];
        
      setFormData(prev => ({
        ...prev,
        [name]: localString
      }));
    }
  };

  const calculateTotal = () => {
    const checkInDate = new Date(formData.check_in);
    const checkOutDate = new Date(formData.check_out);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    
    const selectedRoomData = roomTypes.find(r => r.value === formData.room_type);
    const priceNumerical = selectedRoomData?.price || 1500;
    
    const subtotal = priceNumerical * diffDays;
    const serviceCharge = subtotal * 0.05;
    const vat = (subtotal + serviceCharge) * 0.05;
    const finalTotal = subtotal + serviceCharge + vat;

    return {
      dailyRate: priceNumerical,
      nights: diffDays,
      subtotal,
      serviceCharge,
      vat,
      total: finalTotal
    };
  };

  const nextStep = () => {
    if (activeStep === 1 && (!formData.check_in || !formData.check_out)) return;
    if (activeStep === 2 && !formData.room_type) return;
    setActiveStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => setActiveStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const breakdown = calculateTotal();
    setCalculatedAmount(Math.round(breakdown.total));
    setPriceBreakdown(breakdown);
    setPaymentError('');
    setShowPayment(true);
  };

  /** PAY WITH CHAPA — routes through Edge Function; secret key never touches browser */
  const payWithChapa = async () => {
    setPaymentError('');
    setStatus('loading');

    const nameParts = formData.guest_name.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.slice(1).join(' ') || 'N/A';
    const txRef = generateTxRef();
    const selectedRoomLabel = roomTypes.find(r => r.value === formData.room_type)?.label || 'Room';

    // Store booking details (WITHOUT amount — server recalculates)
    const pendingBooking = {
      guestName: formData.guest_name,
      email: formData.email,
      phone: formData.phone,
      roomId: formData.room_type,
      roomType: selectedRoomLabel,
      checkIn: formData.check_in,
      checkOut: formData.check_out,
      guests: formData.guests,
      specialRequests: formData.special_requests,
    };
    sessionStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));

    const result = await initializeChapaPayment({
      email: formData.email,
      firstName,
      lastName,
      phone: formData.phone,
      txRef,
      roomType: selectedRoomLabel,
      roomId: formData.room_type,
      checkIn: formData.check_in,
      checkOut: formData.check_out,
    });

    if (result.success && result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
    } else {
      setStatus('idle');
      setPaymentError(result.error || 'Failed to initialize payment. Please try again.');
    }
  };

  /** PAY AT HOTEL — Edge Function validates, saves booking, sends notifications server-side */
  const payAtHotel = async () => {
    setStatus('loading');
    setShowPayment(false);
    setPaymentError('');

    try {
      const selectedRoomLabel = roomTypes.find(r => r.value === formData.room_type)?.label || 'Room';

      const result = await createBookingAndNotify({
        guestName: formData.guest_name,
        email: formData.email,
        phone: formData.phone,
        roomId: formData.room_type,
        roomType: selectedRoomLabel,
        checkIn: formData.check_in,
        checkOut: formData.check_out,
        guests: formData.guests,
        specialRequests: formData.special_requests,
      });

      if (result.success) {
        if (result.amount) setCalculatedAmount(result.amount);
        setStatus('success');
      } else {
        setPaymentError(result.error || 'Booking failed');
        setStatus('error');
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStatus('error');
    }
  };

  const selectedRoom = roomTypes.find(r => r.value === formData.room_type);

  return (
    <Layout>
      <SEO
        title="Book Your Stay"
        description="Experience luxury at Arba Minch Wubeté Hotel. Reserve your perfect room online through our secure booking concierge."
        path="/booking"
      />

      {/* ── Cinematic Hero ── */}
      <section className="relative h-[25vh] min-h-[180px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center ken-burns-slow bg-[url(/images/rooms/webetebedroom1.webp)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-brand-offwhite" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="fade-up">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tighter italic">
              Booking <span className="text-brand-gold">Concierge</span>
            </h1>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-3 mt-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                    activeStep === step 
                      ? 'bg-brand-gold text-brand-burgundy scale-110 shadow-lg' 
                      : activeStep > step ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40 border border-white/20'
                  }`}>
                    {activeStep > step ? '✓' : step}
                  </div>
                  {step < 3 && <div className={`w-8 h-px mx-1 ${activeStep > step ? 'bg-green-500' : 'bg-white/20'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#fefaf0] min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {isLockdownActive ? (
            <div className="py-12 fade-up">
              <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-2 border-rose-50 max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 text-rose-500">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif font-black text-slate-900 mb-6 italic">Reservations <span className="text-rose-600">Paused</span></h2>
                <p className="text-slate-500 font-medium mb-10">Our online reservation engine is temporarily offline for maintenance.</p>
                <a href={`tel:${import.meta.env.VITE_HOTEL_PHONE}`} className="inline-flex items-center gap-3 px-8 py-4 bg-brand-burgundy text-brand-gold rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                  <Phone className="w-4 h-4" /> Call Concierge
                </a>
              </div>
            </div>
          ) : status === 'success' ? (
            <div className="py-8 fade-up text-center">
               <div className="mb-12">
                 <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                 </div>
                 <h2 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-4 italic tracking-tight">Reservation <span className="text-brand-gold">Secured</span></h2>
                 <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
                   Thank you for booking with us! Your journey to the Rift Valley has begun. Please present the entry pass below upon arrival at the hotel reception.
                 </p>
               </div>
               
               <StayPass formData={formData} amount={calculatedAmount} roomLabel={selectedRoom?.label} />
               
               <div className="mt-12 flex flex-col items-center gap-6">
                 <p className="text-xs text-brand-burgundy font-black uppercase tracking-widest bg-brand-gold/20 px-6 py-2 rounded-full">
                   A confirmation alert has been sent to our desk
                 </p>
                 <button onClick={() => { setActiveStep(1); setStatus('idle'); }} className="text-brand-burgundy font-black text-xs uppercase tracking-widest hover:text-brand-gold transition-colors flex items-center justify-center gap-2">
                   <ArrowRight className="w-4 h-4 rotate-180" /> Start another reservation
                 </button>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ── Main Form Column ── */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(45,17,21,0.08)] border border-gray-100/50 overflow-hidden relative">
                  
                  {/* Step 1: Dates & Guests */}
                  {activeStep === 1 && (
                    <div className="p-6 md:p-10 step-enter-active">
                      <div className="mb-10">
                        <span className="text-brand-gold font-black text-[9px] uppercase tracking-[0.4em] block mb-2">Step 01</span>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 italic leading-tight">Plan Your Arrival</h2>
                        <div className="w-12 h-1 bg-brand-gold mt-4 rounded-full" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-brand-gold" /> Check-in Date
                          </label>
                          <DatePicker
                            selected={formData.check_in ? new Date(`${formData.check_in}T12:00:00`) : null}
                            onChange={(date: Date | null) => handleDateChange('check_in', date)}
                            minDate={new Date()}
                            placeholderText="Select arrival"
                            className="form-input w-full"
                            wrapperClassName="w-full"
                            dateFormat="MMMM d, yyyy"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-brand-gold" /> Check-out Date
                          </label>
                          <DatePicker
                            selected={formData.check_out ? new Date(`${formData.check_out}T12:00:00`) : null}
                            onChange={(date: Date | null) => handleDateChange('check_out', date)}
                            minDate={formData.check_in ? new Date(`${formData.check_in}T12:00:00`) : new Date()}
                            placeholderText="Select departure"
                            className="form-input w-full"
                            wrapperClassName="w-full"
                            dateFormat="MMMM d, yyyy"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-12">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
                          <Users className="w-3 h-3 text-brand-gold" /> Number of Guests
                        </label>
                        <div className="flex gap-4">
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, guests: num }))}
                              className={`w-12 h-12 rounded-xl font-bold transition-all ${
                                formData.guests === num ? 'bg-brand-burgundy text-brand-gold shadow-lg scale-110' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button onClick={nextStep} disabled={!formData.check_in || !formData.check_out} className="w-full bg-brand-burgundy text-brand-gold py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-30">
                        Continue to Room Selection <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Step 2: Room Choice */}
                  {activeStep === 2 && (
                    <div className="p-6 md:p-10 step-enter-active">
                      <div className="mb-10 flex justify-between items-end">
                        <div>
                          <span className="text-brand-gold font-black text-[9px] uppercase tracking-[0.4em] block mb-2">Step 02</span>
                          <h2 className="text-3xl font-serif font-bold text-gray-900 italic leading-tight">Select Your Sanctuary</h2>
                        </div>
                        <button onClick={prevStep} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-brand-burgundy mb-2">← Back</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                        {roomTypes.map((room) => (
                          <div 
                            key={room.value}
                            onClick={() => room.available && setFormData(prev => ({ ...prev, room_type: room.value }))}
                            className={`group relative rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-500 ${
                              formData.room_type === room.value ? 'border-brand-gold shadow-2xl scale-[1.02]' : 'border-gray-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                            } ${!room.available ? 'cursor-not-allowed opacity-40' : ''}`}
                          >
                            <div className="aspect-[4/3] overflow-hidden">
                              <img src={room.image} alt={room.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                              <div className="flex justify-between items-end">
                                <div>
                                  <h4 className="text-white font-serif font-bold text-lg leading-tight">{room.label}</h4>
                                  <p className="text-brand-gold/80 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Up to {room.capacity} Guests
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-black text-sm">{room.price.toLocaleString()} ETB</p>
                                  <p className="text-white/50 text-[8px] uppercase font-bold tracking-widest">Per Night</p>
                                </div>
                              </div>
                            </div>
                            {formData.room_type === room.value && (
                              <div className="absolute top-4 right-4 w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-brand-burgundy shadow-xl animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                            )}
                            {!room.available && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full">Sold Out</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button onClick={nextStep} disabled={!formData.room_type} className="w-full bg-brand-burgundy text-brand-gold py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-2xl transition-all active:scale-95">
                        Continue to Personal Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Step 3: Registration */}
                  {activeStep === 3 && (
                    <div className="p-6 md:p-10 step-enter-active">
                      <div className="mb-10 flex justify-between items-end">
                        <div>
                          <span className="text-brand-gold font-black text-[9px] uppercase tracking-[0.4em] block mb-2">Step 03</span>
                          <h2 className="text-3xl font-serif font-bold text-gray-900 italic leading-tight">Guest Registration</h2>
                        </div>
                        <button onClick={prevStep} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-brand-burgundy mb-2">← Back</button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Full Name</label>
                            <input type="text" name="guest_name" value={formData.guest_name} onChange={handleChange} required placeholder="John Doe" className="form-input" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="form-input" />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Phone Number</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+251 ..." className="form-input" />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Special Requests (Optional)</label>
                          <textarea name="special_requests" value={formData.special_requests} onChange={handleChange} rows={3} placeholder="Dietary needs, room placement, early arrival..." className="form-input resize-none" />
                        </div>

                        <div className="bg-brand-gold/5 p-6 rounded-2xl border border-brand-gold/20 text-xs font-medium text-brand-burgundy leading-relaxed">
                          <Clock className="w-4 h-4 inline mr-2 text-brand-gold" />
                          <strong>Check-in:</strong> 2:00 PM | <strong>Check-out:</strong> 11:00 AM
                          <br />
                          Early check-in and late check-out is subject to availability.
                        </div>

                        <button type="submit" className="w-full bg-brand-burgundy text-brand-gold py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-2xl transition-all active:scale-95">
                          Finalize Reservation <DoorOpen className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              </div>

              {/* ── Summary Sidebar ── */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                <div className="bg-brand-burgundy text-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  
                  <h3 className="text-xl font-serif font-bold text-brand-gold mb-8 italic">Your Journey</h3>
                  
                  <div className="space-y-6 text-sm relative z-10">
                    <div className="flex justify-between items-start pb-4 border-b border-white/10 group-hover:border-brand-gold/30 transition-colors">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-brand-gold/50 uppercase tracking-widest">Stay Period</span>
                        <div className="font-bold">
                          {formData.check_in ? new Date(formData.check_in).toLocaleDateString() : '—'}
                          <span className="mx-2 text-brand-gold">→</span>
                          {formData.check_out ? new Date(formData.check_out).toLocaleDateString() : '—'}
                        </div>
                      </div>
                      <Calendar className="w-5 h-5 text-brand-gold/40" />
                    </div>

                    <div className="flex justify-between items-start pb-4 border-b border-white/10 group-hover:border-brand-gold/30 transition-colors">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-brand-gold/50 uppercase tracking-widest">Selection</span>
                        <div className="font-bold">{selectedRoom?.label || 'Select a Room'}</div>
                        <div className="text-[10px] text-white/50">{formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}</div>
                      </div>
                      <DoorOpen className="w-5 h-5 text-brand-gold/40" />
                    </div>

                    {(formData.check_in && formData.check_out && formData.room_type) && (
                      <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex justify-between text-[11px] font-medium text-brand-gold/60 uppercase tracking-widest">
                          <span>Subtotal</span>
                          <span>{calculateTotal().subtotal.toLocaleString()} ETB</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-medium text-brand-gold/60 uppercase tracking-widest">
                          <span>Fees (5% + VAT 5%)</span>
                          <span>{(calculateTotal().serviceCharge + calculateTotal().vat).toLocaleString()} ETB</span>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-brand-gold/30">
                          <div>
                            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">Estimated Total</span>
                            <div className="text-3xl font-black text-white tracking-tighter leading-none mt-1">
                              {Math.round(calculateTotal().total).toLocaleString()} 
                              <span className="text-xs text-brand-gold ml-1">ETB</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quality Assured</p>
                  <div className="flex justify-center gap-6 opacity-40">
                    <div title="Secure Payment"><CreditCard className="w-6 h-6" /></div>
                    <div title="24/7 Support"><Phone className="w-6 h-6" /></div>
                    <div title="Instant Confirmation"><CheckCircle2 className="w-6 h-6" /></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Finalized Payment Gateway Modal ── */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-burgundy/40 backdrop-blur-md animate-in fade-in duration-500" onClick={() => { setShowPayment(false); setPaymentError(''); }} />
          <div className="relative bg-white w-full max-w-lg p-6 md:p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] z-10 animate-in zoom-in slide-in-from-bottom-10 duration-500 border border-brand-gold/20">
            
            <button onClick={() => { setShowPayment(false); setPaymentError(''); }} title="Close payment modal" aria-label="Close payment modal" className="absolute top-8 right-8 p-3 text-gray-300 hover:text-brand-burgundy hover:bg-gray-50 rounded-full transition-all duration-300">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-brand-burgundy rotate-12 group-hover:rotate-0 transition-transform">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-brand-burgundy mb-2 italic">Confirm & Settle</h3>
              <p className="text-gray-500 text-sm font-medium">Select your preferred method of settlement.</p>
            </div>

            <div className="bg-brand-burgundy text-white p-8 rounded-3xl border border-brand-gold/30 mb-8 space-y-4 shadow-xl">
              <div className="flex justify-between text-[10px] text-brand-gold/60 font-black uppercase tracking-widest">
                <span>Summary ({priceBreakdown.nights} {priceBreakdown.nights === 1 ? 'Night' : 'Nights'})</span>
                <span>Subtotal</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-b border-white/10 pb-4">
                <span className="text-white/80">{selectedRoom?.label}</span>
                <span>{priceBreakdown.subtotal.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-black text-brand-gold uppercase tracking-[0.3em]">Total Receivable</span>
                <span className="text-3xl font-black text-white tracking-tighter">{priceBreakdown.total.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-xs text-brand-gold">ETB</span></span>
              </div>
            </div>

            {paymentError && (
              <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 animate-in shake-in-x duration-500">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-red-700 uppercase tracking-widest">Transaction Refused</p>
                  <p className="text-[11px] text-red-600 font-medium leading-tight opacity-80">{paymentError}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={payWithChapa}
                disabled={status === 'loading'}
                className="group w-full flex items-center justify-between p-5 rounded-2xl bg-brand-burgundy border-2 border-brand-burgundy hover:bg-brand-gold transition-all duration-500 shadow-xl disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-brand-burgundy transition-colors">
                    <span className="font-black text-brand-gold group-hover:text-white text-sm">CH</span>
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-white group-hover:text-brand-burgundy transition-colors block">Digital Settlement</span>
                    <span className="text-[9px] text-brand-gold/50 group-hover:text-brand-burgundy/60 transition-colors uppercase font-black tracking-widest">Telebirr · CBE Birr · Cards</span>
                  </div>
                </div>
                {status === 'loading' ? (
                  <span className="w-5 h-5 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-brand-gold group-hover:text-brand-burgundy transition-colors" />
                )}
              </button>

              <button
                onClick={payAtHotel}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-gray-100 hover:border-brand-gold hover:bg-yellow-50/50 transition-all duration-500 disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🏨</span>
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-gray-900 block">Pay at Hotel</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Cash or CBE POS on Arrival</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
