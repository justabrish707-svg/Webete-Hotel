import { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BedDouble, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  ArrowUpRight,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  Ban,
  ShieldCheck,
  Menu,
  X,
  Key,
  AlertTriangle,
  Mail
} from 'lucide-react';

import { useHotelStore } from '../store/useHotelStore';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { 
    bookings, rooms, messages, logout, toggleRoomAvailability, 
    addBooking, updateBookingStatus, deleteBooking, markMessageAsRead, 
    deleteMessage, isLockdownActive, toggleLockdown 
  } = useHotelStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);


  const [manualBookingData, setManualBookingData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    roomType: 'Standard Room',
    guests: 1,
    amount: 1500,
    specialRequests: '',
    status: 'Confirmed' as 'Confirmed' | 'Pending' | 'Cancelled'
  });

  const filteredBookings = bookings.filter(b => 
    b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.phone.includes(searchQuery) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const handleManualBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { status, ...rest } = manualBookingData;
    await addBooking(rest, status);
    setIsManualBookingOpen(false);
    setManualBookingData({
      guestName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      roomType: 'Standard Room',
      guests: 1,
      amount: 1500,
      specialRequests: '',
      status: 'Confirmed'
    });
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName] || '')).join(','))
    ].join('\r\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sidebarLinks = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'bookings', icon: CalendarDays, label: 'Reservations' },
    { id: 'rooms', icon: BedDouble, label: 'Inventory' },
    { id: 'guests', icon: Users, label: 'Guest List' },
    { id: 'subscribers', icon: Bell, label: 'Subscribers' },
    { id: 'messages', icon: MessageSquare, label: 'Inquiries' },
    { id: 'settings', icon: Settings, label: 'System Settings' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle2 className="w-3 h-3" />;
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'Cancelled': return <Ban className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans antialiased text-[#1a0a0c] relative overflow-x-hidden selection:bg-brand-gold selection:text-white">
      {/* ── Background Master layer ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-brand-gold/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-brand-burgundy/5 to-transparent rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 via-transparent to-brand-burgundy/5 opacity-40 mix-blend-overlay" />
      </div>

      {/* ── Mobile Overlay ── */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#1a0a0c]/80 backdrop-blur-2xl z-[60] lg:hidden animate-fade-in" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Premium Command Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-[300px] bg-[#1a0a0c] text-white flex flex-col transform transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-white/5 shadow-[20px_0_80px_rgba(0,0,0,0.4)]`}>
        {/* Sidebar Header */}
        <div className="p-8 pb-12">
          <div className="flex items-center justify-between mb-12">
            <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
               <div className="absolute -inset-4 bg-brand-gold/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold via-[#eab308] to-brand-gold p-0.5 shadow-2xl transform group-hover:rotate-[10deg] transition-all duration-500">
                    <div className="w-full h-full bg-[#1a0a0c] rounded-[14px] flex items-center justify-center p-2 overflow-hidden">
                       <img src="/images/branding/logomark.webp" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div>
                     <h1 className="text-2xl font-serif font-black tracking-[0.2em] text-white uppercase leading-none mb-1.5">Wubeté</h1>
                     <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                        <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.4em]">Executive</span>
                     </div>
                  </div>
               </div>
            </div>
            <button className="lg:hidden p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all shadow-inner" title="Close menu" aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        
        {/* Navigation Flux */}
        <nav className="flex-1 px-6 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
          <p className="px-5 text-[9px] font-black text-white/20 uppercase tracking-[0.6em] mb-4">Core Systems</p>
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.75rem] transition-all duration-500 group relative overflow-hidden ${
                activeTab === link.id 
                  ? 'bg-brand-gold text-[#1a0a0c] shadow-[0_20px_40px_rgba(212,175,55,0.2)] font-black translate-x-2' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <div className="flex items-center gap-5 relative z-10">
                <link.icon className={`w-5 h-5 transition-all duration-700 group-hover:scale-125 ${activeTab === link.id ? 'text-[#1a0a0c] -rotate-6' : 'opacity-60'}`} />
                <span className="text-[11px] tracking-[0.4em] uppercase font-black">{link.label}</span>
              </div>
              {activeTab === link.id && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#1a0a0c] shadow-sm relative z-10" />
              )}
              {activeTab === link.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-8 mt-auto">
          <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 mb-8 relative group cursor-help overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="flex items-center gap-4 relative z-10">
               <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]" />
                  <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mb-1">Infrastructure</span>
                  <span className="text-xs font-black text-white uppercase tracking-widest">Network Live</span>
               </div>
            </div>
            
            <div className="mt-5 pt-5 border-t border-white/5 relative z-10">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">Database Uptime</span>
                  <span className="text-[9px] text-brand-gold font-black uppercase">99.9%</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gold rounded-full w-[99%]" />
               </div>
            </div>
          </div>

          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center justify-center gap-4 py-6 rounded-[2rem] bg-rose-500/5 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-700 font-black text-[11px] uppercase tracking-[0.4em] shadow-lg hover:shadow-[0_20px_40px_rgba(244,63,94,0.3)] group/off"
          >
            <LogOut className="w-5 h-5 group-hover/off:-translate-x-1 transition-transform" />
            Deauthorize
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-[280px] p-4 md:p-6 lg:p-10 max-w-[1800px] relative z-10 transition-all duration-500">
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 animate-fade-in">
          <div className="flex items-center gap-6 w-full lg:w-auto">
            <button 
              className="lg:hidden p-4 bg-white/70 backdrop-blur-xl border border-white rounded-2xl hover:border-brand-gold shadow-premium transition-all"
              title="Open menu"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-[#1a0a0c]" />
            </button>
            <div className="relative">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mb-2 opacity-80">
                <span>System Console</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                <span className="text-brand-burgundy">{activeTab}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-[#1a0a0c] tracking-tighter capitalize leading-none">
                {activeTab === 'dashboard' ? 'Executive' : activeTab} <span className="text-brand-gold">Overview</span>
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 lg:flex-none">
              <input 
                type="text" 
                placeholder="Global Database Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-8 py-5 bg-white/60 backdrop-blur-2xl border-2 border-transparent rounded-[2rem] w-full lg:w-96 focus:outline-none focus:ring-4 focus:ring-brand-gold/10 focus:border-brand-gold/50 focus:bg-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.04)] text-sm font-bold placeholder:text-slate-400"
              />
              <Search className="w-6 h-6 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-brand-gold" />
            </div>
            
            <button className="relative p-5 bg-white/60 backdrop-blur-2xl border-2 border-transparent rounded-[2rem] hover:border-brand-gold/50 transition-all shadow-premium group" title="Notifications" aria-label="Notifications">
              <Bell className="w-6 h-6 text-slate-600 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-4 right-4 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
            </button>
            
            <div className="group relative ml-2" onClick={() => navigate('/')}>
               <div className="absolute inset-0 rounded-full border-2 border-brand-gold/30 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000 pointer-events-none" />
              <div className="w-12 h-12 rounded-full bg-[#1a0a0c] flex items-center justify-center text-brand-gold font-bold font-serif shadow-2xl border-2 border-white cursor-pointer transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <span className="text-xl">AD</span>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="fade-up space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Total Revenue', icon: ArrowUpRight, value: `${bookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + b.amount, 0).toLocaleString()} ETB`, trend: '+18.4%', trendUp: true, color: 'emerald' },
                { label: 'Unit Occupancy', icon: BedDouble, value: `${Math.round((rooms.filter(r => !r.available).length / (rooms.length || 1)) * 100)}%`, trend: `${rooms.filter(r => !r.available).length} busy`, trendUp: null, color: 'brand-gold' },
                { label: 'Active Inquiries', icon: MessageSquare, value: messages.filter(m => !m.read).length.toString(), trend: 'Immediate', trendUp: false, color: 'amber' },
                { label: 'Verified Guests', icon: Users, value: new Set(bookings.map(b => b.email)).size.toString(), trend: '+5 new', trendUp: true, color: 'blue' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-premium hover:shadow-[0_40px_80px_rgba(26,10,12,0.1)] transition-all duration-700 relative overflow-hidden group">
                  <div className={`absolute -right-4 -top-4 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000`} />
                  <div className="flex items-center justify-between mb-8">
                     <p className="text-[#1a0a0c]/40 text-[10px] font-black tracking-[0.4em] uppercase">{stat.label}</p>
                     <div className="p-3 bg-[#1a0a0c] text-brand-gold rounded-2xl shadow-xl group-hover:rotate-12 transition-transform">
                        <stat.icon className="w-5 h-5" />
                     </div>
                  </div>
                  <h3 className="text-4xl font-serif font-black text-[#1a0a0c] mb-2 tracking-tighter">{stat.value}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${stat.trendUp === true ? 'bg-emerald-500/10 text-emerald-600' : stat.trendUp === false ? 'bg-rose-500/10 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                      {stat.trendUp === true ? '↑' : stat.trendUp === false ? '↓' : '•'} {stat.trend}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Growth</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Core Analytics & Interaction */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* Transactions Table */}
              <div className="xl:col-span-2 bg-white/70 backdrop-blur-3xl rounded-[3.5rem] border border-white shadow-premium flex flex-col overflow-hidden group">
                <div className="p-10 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 bg-white/40">
                  <div>
                    <h3 className="text-3xl font-serif font-black text-gray-900 tracking-tight">Recent Activity Feed</h3>
                    <p className="text-xs text-slate-400 font-bold tracking-[0.2em] uppercase mt-2 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Real-time Synchronized
                    </p>
                  </div>
                  <button className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-[#1a0a0c] text-brand-gold rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-brand-burgundy hover:-translate-y-1 transition-all active:scale-95" onClick={() => exportToCSV(bookings, 'live_export')}>
                    <Download className="w-5 h-5" /> Export Data
                  </button>
                </div>
                
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50 hover:bg-transparent">
                        <th className="py-8 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Resident Identity</th>
                        <th className="py-8 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Asset Allocation</th>
                        <th className="py-8 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Status Verification</th>
                        <th className="py-8 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Payment</th>
                        <th className="py-8 px-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(searchQuery ? filteredBookings : bookings).slice(0, 8).map((booking) => (
                        <tr key={booking.id} className="group hover:bg-white transition-all duration-500">
                          <td className="py-8 px-10">
                              <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-3xl bg-[#1a0a0c] flex items-center justify-center text-brand-gold font-serif font-black text-2xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                                   {booking.guestName.charAt(0)}
                                </div>
                                <div>
                                  <span className="text-lg font-black text-[#1a0a0c] block tracking-tight">{booking.guestName}</span>
                                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{booking.phone}</span>
                                </div>
                              </div>
                          </td>
                          <td className="py-8 px-10">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{booking.roomType}</span>
                              <span className="text-2xl font-serif font-black text-[#1a0a0c]">{booking.amount.toLocaleString()} <span className="text-[10px] text-brand-gold uppercase tracking-widest font-sans">ETB</span></span>
                            </div>
                          </td>
                          <td className="py-8 px-10">
                            <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border flex items-center gap-3 w-fit shadow-lg backdrop-blur-xl ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </div>
                          </td>
                          <td className="py-8 px-10">
                            {booking.status === 'Confirmed' ? (
                              <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <Clock className="w-3.5 h-3.5" />
                                Processing
                              </div>
                            )}
                          </td>
                          <td className="py-8 px-10 text-right">
                             <button className="p-4 bg-slate-50 hover:bg-[#1a0a0c] hover:text-brand-gold rounded-full text-slate-400 transition-all shadow-premium active:scale-95" title="View booking details" aria-label="View booking details">
                               <ArrowUpRight className="w-5 h-5" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar Action Cards */}
              <div className="space-y-10">
                {/* Inventory Radar */}
                <div className="bg-[#1a0a0c] p-10 rounded-[3.5rem] shadow-[0_40px_100px_rgba(26,10,12,0.4)] relative overflow-hidden group border border-[#1a0a0c]/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className="flex items-center justify-between mb-12 relative z-10">
                    <h3 className="text-3xl font-serif font-black text-white tracking-tight flex flex-col">
                       Inventory <span className="text-brand-gold text-lg tracking-[0.3em] uppercase mt-1">Status Radar</span>
                    </h3>
                    <div className="p-4 bg-white/10 rounded-3xl border border-white/10">
                       <BedDouble className="w-8 h-8 text-brand-gold" />
                    </div>
                  </div>

                  <div className="space-y-5 relative z-10">
                     {rooms.slice(0, 5).map(room => (
                       <div key={room.id} className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer group/unit shadow-2xl">
                          <div className="flex items-center gap-6">
                             <div className={`w-3.5 h-3.5 rounded-full ${room.available ? 'bg-emerald-400' : 'bg-rose-500'} shadow-[0_0_20px_rgba(16,185,129,0.4)] relative`}>
                                <div className={`absolute inset-[-4px] rounded-full ${room.available ? 'bg-emerald-400/20' : 'bg-rose-500/20'} animate-ping`} />
                             </div>
                             <div className="flex flex-col">
                               <span className="text-lg font-bold text-white tracking-tight leading-none mb-1">{room.name}</span>
                               <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">{room.type}</span>
                             </div>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleRoomAvailability(room.id); }} className={`p-2.5 rounded-xl border transition-all ${room.available ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20 hover:bg-emerald-500 hover:text-white' : 'bg-rose-500/10 text-rose-400 border-rose-400/20 hover:bg-rose-500 hover:text-white'}`}>
                             {room.available ? <Plus className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </button>
                       </div>
                     ))}
                  </div>

                  <button onClick={() => setActiveTab('rooms')} className="w-full mt-10 py-6 bg-gradient-to-br from-brand-gold to-[#fcd34d] text-[#1a0a0c] rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(212,175,55,0.4)] hover:shadow-[0_30px_80px_rgba(212,175,55,0.6)] hover:-translate-y-2 transition-all duration-500 active:scale-95">
                     Access Full Inventory
                  </button>
                </div>

                {/* Directive Grid */}
                <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white shadow-premium group">
                   <h3 className="text-3xl font-serif font-black text-[#1a0a0c] mb-10 tracking-tight flex items-center gap-4">
                      Directives <span className="w-full h-px bg-gradient-to-r from-brand-gold to-transparent opacity-30" />
                   </h3>
<div className="grid grid-cols-2 gap-6">
                       {[
                         { label: 'New Booking', icon: Plus, action: () => setIsManualBookingOpen(true), bg: 'bg-brand-burgundy', color: 'text-brand-gold' },
                         { label: 'Broadcast', icon: Bell, action: () => setActiveTab('messages'), bg: 'bg-white', color: 'text-slate-800' },
                         { label: 'Guest Search', icon: Search, action: () => setActiveTab('guests'), bg: 'bg-brand-gold', color: 'text-[#1a0a0c]' },
                         { label: 'Export Data', icon: Download, action: () => exportToCSV(bookings, 'full_data'), bg: 'bg-emerald-500', color: 'text-white' },
                       ].map((btn, i) => (
                         <button 
                           key={i} 
                           onClick={btn.action} 
                           className={`p-6 h-40 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl active:scale-95 group/btn relative overflow-hidden border border-slate-100 shadow-premium ${btn.bg}`}
                         >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                            <btn.icon className={`w-10 h-10 group-hover/btn:rotate-12 group-hover/btn:scale-125 transition-transform duration-700 relative z-10 ${btn.color}`} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.3em] text-center relative z-10 leading-tight ${btn.color}`}>{btn.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>
                    
                    <div className="flex justify-center gap-10">
                       <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Sentinel Protection: Active</span>
                       </div>
                       <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Audit Logs: Syncronizing</span>
                       </div>
                    </div>

                    {/* Security Audit Log */}
                    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 p-8 shadow-sm">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                          <Clock className="w-4 h-4" /> Recent Security Exceptions & Events
                       </h5>
                       <div className="space-y-3">
                          {[
                             { event: 'Credential Update Protocol', time: 'Just now', status: 'Success', icon: Key },
                             { event: 'Admin Session Initialization', time: '14 mins ago', status: 'Verified', icon: ShieldCheck },
                             { event: 'IP Access Validation', time: '2 hours ago', status: 'Authorized', icon: Search },
                             { event: 'Global Lockdown Test', time: 'Yesterday', status: 'System Ready', icon: AlertTriangle },
                          ].map((log, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-white/50 hover:bg-white transition-all group">
                                <div className="flex items-center gap-4">
                                   <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-[#1a0a0c] group-hover:text-brand-gold transition-all">
                                      <log.icon className="w-4 h-4" />
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black text-[#1a0a0c] tracking-tight">{log.event}</p>
                                      <p className="text-[9px] text-slate-400 font-bold uppercase">{log.time}</p>
                                   </div>
                                </div>
                                <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-100">{log.status}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
                </div>
            </div>
         )}

        {/* ── Reservations Ledger ── */}
        {activeTab === 'bookings' && (
          <div className="space-y-8 fade-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-serif font-black text-[#1a0a0c]">Global Reservations</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Historical & Active Ledger Control</p>
              </div>
              <button 
                onClick={() => setIsManualBookingOpen(true)}
                className="px-8 py-4 bg-brand-gold text-brand-burgundy rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-brand-burgundy hover:text-white transition-all transform active:scale-95"
              >
                + Rapid Entry
              </button>
            </div>

            <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] border border-white shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="py-6 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Guest</th>
                      <th className="py-6 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Contacts</th>
                      <th className="py-6 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Room & Pricing</th>
                      <th className="py-6 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Status Control</th>
                      <th className="py-6 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-6 px-8">
                          <div className="font-serif font-black text-[#1a0a0c]">{b.guestName}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{b.id}</div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="text-xs font-bold text-slate-600">{b.email}</div>
                          <div className="text-[10px] text-slate-400">{b.phone}</div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="text-xs font-bold text-slate-600 italic">{b.roomType}</div>
                          <div className="text-[10px] font-black text-brand-gold uppercase">{b.amount.toLocaleString()} ETB</div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="flex gap-2">
                            {['Confirmed', 'Pending', 'Cancelled'].map((s) => (
                              <button 
                                key={s}
                                onClick={() => updateBookingStatus(b.id, s as any)}
                                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                  b.status === s 
                                    ? 'bg-[#1a0a0c] text-brand-gold shadow-lg scale-105' 
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-6 px-8 text-right">
                          <button 
                            onClick={() => { if(window.confirm('Erase this record from ledger?')) deleteBooking(b.id); }}
                            title="Delete Record"
                            aria-label="Delete record"
                            className="inline-flex w-10 h-10 rounded-xl bg-rose-50 text-rose-500 items-center justify-center hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Room Inventory ── */}
        {activeTab === 'rooms' && (
          <div className="space-y-12 fade-up">
            <div>
              <h1 className="text-4xl font-serif font-black text-[#1a0a0c]">Physical Inventory</h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Room Availability & Rate Management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white/80 backdrop-blur-2xl overflow-hidden group border border-white rounded-[2.5rem] shadow-premium">
                  <div className="h-48 relative overflow-hidden">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="text-white font-serif font-black text-xl">{room.name}</div>
                      <div className="text-brand-gold text-[10px] font-black uppercase tracking-[0.2em]">{room.type}</div>
                    </div>
                    <div className={`absolute top-6 right-6 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border ${
                      room.available ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {room.available ? 'Live' : 'Maintenance'}
                    </div>
                  </div>
                  <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-serif font-black text-[#1a0a0c] italic">{room.price.toLocaleString()} <span className="text-[10px] text-slate-400 not-italic uppercase tracking-widest">ETB / Night</span></div>
                    </div>
                    <button 
                      onClick={() => toggleRoomAvailability(room.id)}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        room.available 
                          ? 'bg-[#1a0a0c] text-brand-gold hover:bg-brand-burgundy hover:text-white' 
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                    >
                      {room.available ? 'Mark as Out-of-Service' : 'Restore to Inventory'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Guest Inquiries ── */}
        {activeTab === 'messages' && (
          <div className="space-y-12 fade-up">
            <div>
              <h1 className="text-4xl font-serif font-black text-[#1a0a0c]">Digital Correspondence</h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Guest Relations & Inquiry Inbox</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white shadow-premium transition-all ${!msg.read ? 'ring-2 ring-brand-gold/30' : 'opacity-80'}`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif font-black ${!msg.read ? 'bg-brand-gold text-brand-burgundy' : 'bg-slate-100 text-slate-400'}`}>
                          {msg.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-bold text-[#1a0a0c]">{msg.subject}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.name} • {msg.email}</p>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-light italic">{msg.message}</p>
                    </div>
                    <div className="flex md:flex-col gap-4">
                      {!msg.read && (
                        <button 
                          onClick={() => markMessageAsRead(msg.id)}
                          className="px-6 py-3 bg-brand-gold text-brand-burgundy rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-brand-burgundy hover:text-white transition-all shadow-lg"
                        >
                          Mark Viewed
                        </button>
                      )}
                      <button 
                         onClick={() => { if(window.confirm('Delete this message?')) deleteMessage(msg.id); }}
                         className="px-6 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                      >
                        Purge
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="py-32 text-center bg-white/40 backdrop-blur-md rounded-[3rem] border border-white">
                  <Mail className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                  <p className="text-slate-400 font-serif font-bold italic text-xl">Inbox is vacant...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Guest Ledger ── */}
        {activeTab === 'guests' && (
          <div className="space-y-12 fade-up">
            <div>
              <h1 className="text-4xl font-serif font-black text-[#1a0a0c]">Guest Directory</h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Executive Resident Management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from(new Set(bookings.map(b => b.email))).map(email => {
                const guest = bookings.find(b => b.email === email)!;
                const guestBookings = bookings.filter(b => b.email === email);
                return (
                  <div key={email} className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-premium group hover:-translate-y-2 transition-all duration-500">
                    <div className="flex items-center gap-6 mb-8">
                       <div className="w-16 h-16 rounded-3xl bg-[#1a0a0c] text-brand-gold flex items-center justify-center font-serif font-black text-3xl shadow-2xl">
                          {guest.guestName.charAt(0)}
                       </div>
                       <div>
                          <h4 className="text-xl font-serif font-black text-[#1a0a0c] tracking-tight">{guest.guestName}</h4>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">Verified Resident</span>
                       </div>
                    </div>
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-bold uppercase tracking-widest">Digital ID</span>
                          <span className="text-[#1a0a0c] font-bold">{guest.email}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-bold uppercase tracking-widest">Total Stays</span>
                          <span className="text-brand-burgundy font-black">{guestBookings.length} Visits</span>
                       </div>
                       <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-bold uppercase tracking-widest">Lifetime Value</span>
                          <span className="text-emerald-600 font-black">{guestBookings.reduce((s, b) => s + b.amount, 0).toLocaleString()} <span className="text-[9px]">ETB</span></span>
                       </div>
                    </div>
                    <button className="w-full py-4 bg-slate-50 text-[#1a0a0c] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1a0a0c] hover:text-brand-gold transition-all">View Full Dossier</button>
                  </div>
                );
              })}
              {bookings.length === 0 && (
                <div className="col-span-full py-32 text-center bg-white/40 backdrop-blur-md rounded-[3rem] border border-white">
                  <p className="text-slate-400 font-serif font-bold italic text-xl">Directory is empty...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Subscriber Network ── */}
        {activeTab === 'subscribers' && (
          <div className="space-y-12 fade-up">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-serif font-black text-[#1a0a0c]">Digital Newsletter</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Broadcast Distribution Network</p>
              </div>
              <button className="px-8 py-4 bg-[#1a0a0c] text-brand-gold rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-brand-burgundy hover:text-white transition-all">
                 Initialize Broadcast
              </button>
            </div>

            <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white p-12 text-center shadow-premium">
               <div className="max-w-md mx-auto py-12">
                  <Bell className="w-16 h-16 text-brand-gold mx-auto mb-8 animate-bounce" />
                  <h3 className="text-2xl font-serif font-black text-[#1a0a0c] mb-4 italic">No Active Subscribers Found</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-10">The subscription relay is currently idling. All new guest enrollments will appear here for marketing distribution.</p>
                  <div className="flex justify-center gap-4">
                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-slate-200" /> Relay: Ready
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-slate-200" /> Database: Scanned
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ── System Configuration ── */}
        {activeTab === 'settings' && (
          <div className="space-y-12 fade-up">
            <div>
              <h1 className="text-4xl font-serif font-black text-[#1a0a0c]">System Architecture</h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Core Infrastructure & Policy Control</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* Lockdown Protocol */}
               <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-premium relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                  <div className="flex items-center gap-6 mb-10">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isLockdownActive ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                        <AlertTriangle className="w-7 h-7" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-serif font-black text-[#1a0a0c]">Lockdown Protocol</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Emergency Site Access Control</p>
                     </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-10 leading-relaxed italic">Activating this selector will temporarily suspend all public-facing reservations and navigation. Use only in emergency data synchronization scenarios.</p>
                  <button 
                    onClick={() => toggleLockdown()}
                    className={`w-full py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-700 shadow-xl ${
                      isLockdownActive 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-rose-500 text-white hover:bg-[#1a0a0c] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]'
                    }`}
                  >
                     {isLockdownActive ? 'Deactivate Sentinel Lockdown' : 'Authorize Emergency Lockdown'}
                  </button>
               </div>

               {/* Infrastructure Audit */}
               <div className="bg-[#1a0a0c] p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(26,10,12,0.3)] border border-[#1a0a0c]/20">
                  <h3 className="text-2xl font-serif font-black text-white mb-10 tracking-tight flex items-center justify-between">
                     Infrastructure Status <span className="text-brand-gold text-[10px] uppercase font-black tracking-widest bg-white/5 py-1 px-3 rounded-lg border border-white/5 italic">Operational</span>
                  </h3>
                  <div className="space-y-6">
                     {[
                        { label: 'Supabase Relay', status: 'Healthy', color: 'emerald', delay: '12ms' },
                        { label: 'Resend SMTP', status: 'Authorized', color: 'brand-gold', delay: '45ms' },
                        { label: 'Chapa Gateway', status: 'Live', color: 'emerald', delay: '202ms' },
                        { label: 'CDN Edge Nodes', status: 'Distributed', color: 'emerald', delay: '8ms' },
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                           <div className="flex items-center gap-4">
                              <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'Healthy' || item.status === 'Live' || item.status === 'Distributed' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-brand-gold shadow-[0_0_15px_rgba(196,164,132,0.5)]'}`} />
                              <span className="text-sm font-bold text-white/80">{item.label}</span>
                           </div>
                           <div className="flex flex-col items-end">
                              <span className={`text-[9px] font-black uppercase ${item.status === 'Healthy' || item.status === 'Live' || item.status === 'Distributed' ? 'text-emerald-400' : 'text-brand-gold'}`}>{item.status}</span>
                              <span className="text-[8px] font-bold text-white/20">{item.delay}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Admin Identity Management */}
               <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white shadow-premium">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-10">
                     <div>
                        <h3 className="text-3xl font-serif font-black text-[#1a0a0c]">Deauthorization & Identity</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update Executive Access Credentials</p>
                     </div>
                     <div className="flex gap-4">
                        <button className="px-10 py-5 bg-slate-50 text-[#1a0a0c] border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-brand-gold transition-all">Request Audit Log</button>
                        <button className="px-10 py-5 bg-[#1a0a0c] text-brand-gold rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-brand-burgundy hover:text-white transition-all">Update Key Code</button>
                     </div>
                  </div>
                  <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 flex items-center gap-4">
                     <AlertTriangle className="w-5 h-5 text-rose-500" />
                     <p className="text-[11px] text-rose-700 font-medium italic">Strict Warning: Credential rotation will invalidate all active executive sessions across all nodes and mobile instances.</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Manual Booking Modal ── */}
      {isManualBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 fade-up">
            <div className="bg-[#1a0a0c] p-8 text-brand-gold flex justify-between items-center">
              <div>
                 <h3 className="text-2xl font-serif font-black tracking-tight">Manual Reservation</h3>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Internal Admin Override</p>
              </div>
              <button onClick={() => setIsManualBookingOpen(false)} title="Close" aria-label="Close booking form" className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleManualBookingSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-2">Guest Full Name</label>
                <input type="text" required aria-label="Guest Full Name" placeholder="John Doe" value={manualBookingData.guestName} onChange={e => setManualBookingData(p => ({ ...p, guestName: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-gold/50 focus:bg-white outline-none font-bold" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-2">Email Address</label>
                <input type="email" required aria-label="Email Address" placeholder="john@example.com" value={manualBookingData.email} onChange={e => setManualBookingData(p => ({ ...p, email: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-gold/50 focus:bg-white outline-none font-bold" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-2">Phone Primary</label>
                <input type="text" required aria-label="Phone Number" placeholder="+251 ..." value={manualBookingData.phone} onChange={e => setManualBookingData(p => ({ ...p, phone: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-gold/50 focus:bg-white outline-none font-bold" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-2">Room Inventory</label>
                <select value={manualBookingData.roomType} title="Room Inventory" aria-label="Room Inventory" onChange={e => setManualBookingData(p => ({ ...p, roomType: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-gold/50 focus:bg-white outline-none font-bold">
                  <option value="Standard Room">Standard Unit</option>
                  <option value="Deluxe Room">Deluxe Lake View</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Family Suite">Family Villa</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-2">Arrival Date</label>
                <input type="date" required aria-label="Arrival Date" placeholder="Arrival date" value={manualBookingData.checkIn} onChange={e => setManualBookingData(p => ({ ...p, checkIn: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-gold/50 focus:bg-white outline-none font-bold" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-2">Departure Date</label>
                <input type="date" required aria-label="Departure Date" placeholder="Departure date" value={manualBookingData.checkOut} onChange={e => setManualBookingData(p => ({ ...p, checkOut: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-gold/50 focus:bg-white outline-none font-bold" />
              </div>
              <div className="space-y-4 col-span-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-2">Operational Status</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Confirmed', 'Pending', 'Cancelled'].map(s => (
                     <button key={s} type="button" onClick={() => setManualBookingData(p => ({ ...p, status: s as 'Confirmed' | 'Pending' | 'Cancelled' }))} className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${manualBookingData.status === s ? 'bg-[#1a0a0c] text-brand-gold border-[#1a0a0c]' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-brand-gold/30'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 pt-6 border-t border-slate-100">
                <button type="submit" className="w-full py-6 bg-brand-gold text-[#1a0a0c] rounded-[1.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-xl hover:bg-brand-burgundy hover:text-white transition-all transform active:scale-95">Verify & Inject Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
