import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Navigation } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useHotelStore } from '../store/useHotelStore';
import { sendContactInquiry } from '../utils/notifications';
import confetti from 'canvas-confetti';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: searchParams.get('subject') || '',
    message: '',
  });

  // Update subject if URL changes (e.g. user navigates between different contact links)
  useEffect(() => {
    const sub = searchParams.get('subject');
    if (sub) {
      setFormData(prev => ({ ...prev, subject: sub }));
    }
  }, [searchParams]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
  const addMessage = useHotelStore(state => state.addMessage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const result = await sendContactInquiry(formData);
      
      if (result.success) {
        // Sync local store for admin view
        await addMessage(formData);
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <Layout>
      <SEO
        title="Contact Our Concierge"
        description="Get in touch with the Arba Minch Wubeté Hotel concierge team. We're available 24/7 to help plan your perfect stay, answer inquiries, or arrange special requests."
        path="/contact"
      />
      {/* ── Editorial Hero ── */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 animate-[ken-burns_25s_ease-infinite_alternate] bg-[url(/building_night_1.png)]"
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
                 Connect With Us
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-white mb-8 tracking-tighter leading-[0.85] drop-shadow-2xl italic">
              At Your <span className="text-brand-gold/90 font-extralight not-italic">Service</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed fade-up stagger-3">
              We are here to curate your perfect Rift Valley escape.
            </p>
          </div>
        </div>
      </section>

      {/* ── Split Contact Area ── */}
      <section className="py-12 bg-mesh relative z-20">
        <div className="max-w-7xl mx-auto px-6 -mt-32 relative">
          <div className="premium-card !p-0 overflow-hidden flex flex-col lg:flex-row border-[6px] border-white/40">
            
            {/* Left: Info Side */}
            <div className="lg:w-5/12 bg-brand-burgundy p-6 md:p-5 relative overflow-hidden text-white flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-48 bg-brand-gold/10 rounded-full blur-[100px] -mr-10 -mt-5" />
              <div className="absolute bottom-0 left-0 w-64 h-48 bg-black/20 rounded-full blur-[100px] -ml-20 -mb-5" />
              
              <div className="relative z-10">
                <h2 className="text-2xl md:text-2xl font-serif font-bold mb-4 tracking-tight">Contact <br /><span className="text-brand-gold italic font-normal">Information</span></h2>
                <p className="text-white/70 font-medium mb-8 leading-relaxed">
                  Reach out directly to our concierge desk. We respond to all inquiries within 24 hours to ensure your absolute comfort.
                </p>

                <div className="space-y-12">
                  <div className="flex items-start space-x-6 group">
                    <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-brand-gold transition-colors shrink-0">
                      <MapPin className="w-5 h-5 text-brand-gold group-hover:text-brand-burgundy" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black tracking-widest uppercase text-white/50 mb-2">Location</h3>
                      <p className="text-lg font-medium leading-relaxed">
                        Sile Zerihun, Arbaminch<br />
                        Southern Nations, Ethiopia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group">
                    <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-brand-gold transition-colors shrink-0">
                      <Phone className="w-5 h-5 text-brand-gold group-hover:text-brand-burgundy" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black tracking-widest uppercase text-white/50 mb-2">Direct Line</h3>
                      <a href={`tel:${import.meta.env.VITE_HOTEL_PHONE}`} className="text-xl font-medium hover:text-brand-gold transition-colors">
                        {import.meta.env.VITE_HOTEL_PHONE}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group">
                    <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-brand-gold transition-colors shrink-0">
                      <Mail className="w-5 h-5 text-brand-gold group-hover:text-brand-burgundy" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black tracking-widest uppercase text-white/50 mb-2">Email Desk</h3>
                      <a href={`mailto:${import.meta.env.VITE_HOTEL_EMAIL}`} className="text-lg font-medium hover:text-brand-gold transition-colors">
                        {import.meta.env.VITE_HOTEL_EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group">
                    <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-brand-gold transition-colors shrink-0">
                      <Clock className="w-5 h-5 text-brand-gold group-hover:text-brand-burgundy" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black tracking-widest uppercase text-white/50 mb-2">Operating Hours</h3>
                      <p className="text-lg font-medium leading-relaxed">
                        Reception: 24/7 Support
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form Side */}
            <div className="lg:w-7/12 p-6 md:p-5 lg:px-20 bg-white relative">
              {status === 'success' ? (
                <div className="py-12 border-none">
                  <div className="premium-card !bg-gray-50/50 !p-12 text-center fade-up relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl" />
                    <div className="w-24 h-24 bg-brand-burgundy rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl scale-110">
                      <CheckCircle2 className="w-12 h-12 text-brand-gold" />
                    </div>
                    <h2 className="text-4xl font-serif font-black text-gray-900 mb-6 italic tracking-tight">Message <span className="text-brand-gold">Delivered</span></h2>
                    <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed mb-10 italic">
                      "Thank you! Our concierge team aims to respond within 24 hours."
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={() => setStatus('idle')}
                        className="px-8 py-4 bg-brand-burgundy text-brand-gold rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                      >
                         Send Another Inquiry
                      </button>
                      <Link 
                        to="/"
                        className="px-8 py-4 bg-white text-brand-burgundy border border-gray-100 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                      >
                         Return Home
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 tracking-tight">Drop us a line</h2>
                    <p className="text-gray-500 font-medium">Use the form below to submit any special requests or inquiries.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Samuel Alemu"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                      className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-all font-medium disabled:opacity-50 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                       Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="hello@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                      className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-all font-medium disabled:opacity-50 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we assist you?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-all font-medium disabled:opacity-50 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                    Message Details
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Provide details regarding your inquiry..."
                    disabled={status === 'loading'}
                    className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-all font-medium disabled:opacity-50 resize-none text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div className="pt-4">
                   <button
                     type="submit"
                     disabled={status === 'loading' || status === 'success'}
                     className="w-full bg-[#2d1115] text-[#fefaf0] px-8 py-6 rounded-[1.5rem] hover:bg-brand-gold hover:text-brand-burgundy transition-all duration-500 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(45,17,21,0.15)] disabled:opacity-50 group hover:shadow-[0_15px_30px_rgba(196,164,132,0.3)] active:scale-95"
                   >
                     {status === 'loading' ? (
                       <span className="w-5 h-5 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                     ) : (
                       <>Send Secure Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                     )}
                   </button>
                </div>

                {status === 'error' && (
                  <p className="text-red-700 text-center font-bold bg-red-50 p-4 rounded-xl border border-red-100">
                    An error occurred. Please try again or call us.
                  </p>
                )}
              </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Immersive Map Section ── */}
      <section className="py-24 bg-mesh min-h-[600px] flex items-center border-t border-brand-burgundy/5">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6 fade-up">
             <div>
                <span className="text-brand-burgundy/60 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Navigation</span>
                <h2 className="text-5xl md:text-6xl font-serif font-black text-gray-900 leading-[1] tracking-tighter italic">
                  Find Your <span className="text-brand-gold">Way</span>
                </h2>
             </div>
              <a 
                href="https://maps.google.com/?q=Arbaminch,Ethiopia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-premium flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" /> Open map
              </a>
          </div>
          
          <div className="rounded-[2rem] overflow-hidden shadow-2xl h-[550px] border-4 border-white relative group fade-up stagger-1">
            <div className="absolute inset-0 bg-brand-burgundy/5 group-hover:bg-transparent transition-colors duration-1000 pointer-events-none z-10" />
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              title="Arbaminch Webete Hotel Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3938.819563438843!2d36.541219!3d6.028536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1784d3b4b4b4b4b5%3A0x0!2sArba+Minch%2C+Ethiopia!5e0!3m2!1sen!2set!4v1699000000000"
              className="grayscale-[0.2] contrast-[1.05] group-hover:grayscale-0 transition-all duration-1000"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
