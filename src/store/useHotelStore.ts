import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Booking {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  specialRequests: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  amount: number;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
  image: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface HotelState {
  isAuthenticated: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  updateAdminPassword: (newPassword: string) => Promise<boolean>;
  isLockdownActive: boolean;
  toggleLockdown: () => void;
  initializeStore: () => Promise<void>;

  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>, status?: Booking['status']) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;

  rooms: Room[];
  toggleRoomAvailability: (id: string) => Promise<void>;
  updateRoomPrice: (id: string, price: number) => Promise<void>;

  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'read' | 'createdAt'>) => Promise<void>;
  markMessageAsRead: (id: string) => Promise<void>;
}

export const useHotelStore = create<HotelState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,

      login: async (code: string) => {
        // Auth MUST go through Supabase — no plaintext fallback stored in the bundle
        if (!isSupabaseConfigured) {
          console.error('Supabase not configured. Admin login requires Supabase Auth.');
          return false;
        }
        const email = import.meta.env.VITE_HOTEL_EMAIL || 'admin@webetehotel.com';
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: code });
        if (!error && data.session) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        // Always sign out from Supabase to invalidate the server-side token
        if (isSupabaseConfigured) {
          supabase.auth.signOut().catch(() => {});
        }
        set({ isAuthenticated: false });
      },

      // Password update — Supabase only, never stored locally
      updateAdminPassword: async (newPassword: string): Promise<boolean> => {
        if (!isSupabaseConfigured) return false;
        if (newPassword.length < 8) return false; // Enforce minimum length
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return !error;
      },

      isLockdownActive: false,
      toggleLockdown: async () => {
        const newValue = !get().isLockdownActive;
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('system_settings').upsert({ key: 'lockdown', value: newValue });
          if (error) {
            console.error('Failed to sync lockdown status:', error.message);
            return;
          }
        }
        set({ isLockdownActive: newValue });
      },

      initializeStore: async () => {
        if (!isSupabaseConfigured) return;

        try {
          // ── Initial Fetch ──
          
          // Rooms
          const { data: roomsData } = await supabase.from('rooms').select('*');
          if (roomsData) set({ rooms: roomsData as Room[] });

          // Bookings
          const { data: bookingsData } = await supabase
            .from('bookings').select('*').order('created_at', { ascending: false });
          if (bookingsData) {
            const mapped = (bookingsData as Record<string, any>[]).map(b => ({
              id: b.id,
              guestName: b.guest_name,
              email: b.email,
              phone: b.phone,
              checkIn: b.check_in,
              checkOut: b.check_out,
              roomType: b.room_type,
              guests: b.guests,
              specialRequests: b.special_requests,
              status: b.status,
              amount: b.amount,
              createdAt: b.created_at,
            }));
            set({ bookings: mapped });
          }

          // Messages
          const { data: messagesData } = await supabase
            .from('messages').select('*').order('created_at', { ascending: false });
          if (messagesData) {
            const mapped = (messagesData as Record<string, any>[]).map(m => ({
              id: m.id,
              name: m.name,
              email: m.email,
              subject: m.subject,
              message: m.message,
              read: m.read,
              createdAt: m.created_at,
            }));
            set({ messages: mapped });
          }

          // Settings
          const { data: settingsData } = await supabase
            .from('system_settings').select('*').eq('key', 'lockdown').single();
          if (settingsData) set({ isLockdownActive: !!settingsData.value });

          // ── Realtime Subscriptions ──
          
          // Listen for new bookings
          supabase
            .channel('public:bookings')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, payload => {
              const b = payload.new as any;
              const newBooking: Booking = {
                id: b.id,
                guestName: b.guest_name,
                email: b.email,
                phone: b.phone,
                checkIn: b.check_in,
                checkOut: b.check_out,
                roomType: b.room_type,
                guests: b.guests,
                specialRequests: b.special_requests,
                status: b.status,
                amount: b.amount,
                createdAt: b.created_at,
              };
              set(state => ({ bookings: [newBooking, ...state.bookings] }));
            })
            .subscribe();

          // Listen for new messages
          supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
              const m = payload.new as any;
              const newMsg: Message = {
                id: m.id,
                name: m.name,
                email: m.email,
                subject: m.subject,
                message: m.message,
                read: m.read,
                createdAt: m.created_at,
              };
              set(state => ({ messages: [newMsg, ...state.messages] }));
            })
            .subscribe();

        } catch (err) {
          console.error('initializeStore error:', err);
        }
      },

      bookings: [
        {
          id: '#BK-001',
          guestName: 'Michael Chen',
          email: 'michael.c@example.com',
          phone: '+251 911 234 567',
          roomType: 'Deluxe Room',
          checkIn: '2026-10-15',
          checkOut: '2026-10-18',
          guests: 2,
          specialRequests: 'Late checkout if possible.',
          status: 'Confirmed',
          amount: 6600,
          createdAt: new Date().toISOString(),
        }
      ],

      addBooking: async (bookingData, status = 'Pending') => {
        const newBooking: Booking = {
          ...bookingData,
          id: `#BK-${String(get().bookings.length + 1).padStart(3, '0')}-${Date.now().toString().slice(-3)}`,
          status,
          createdAt: new Date().toISOString(),
        };

        // NOTE: New bookings created by guests are now handled by Edge Functions (server-side).
        // This addBooking is retained for admin-side manual additions only.
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('bookings').insert([{
            id: newBooking.id,
            guest_name: newBooking.guestName,
            email: newBooking.email,
            phone: newBooking.phone,
            check_in: newBooking.checkIn,
            check_out: newBooking.checkOut,
            room_type: newBooking.roomType,
            guests: newBooking.guests,
            special_requests: newBooking.specialRequests,
            status: newBooking.status,
            amount: newBooking.amount,
            created_at: newBooking.createdAt,
          }]);
          if (error) console.error('addBooking error:', error.message);
        }
        set((state) => ({ bookings: [newBooking, ...state.bookings] }));
      },

      updateBookingStatus: async (id, status) => {
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
          if (error) console.error('updateBookingStatus error:', error.message);
        }
        set((state) => ({
          bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b),
        }));
      },

      rooms: [
        { id: '101', name: 'Standard Unit A', type: 'Standard Room', price: 1500, capacity: 2, available: true, image: '/webete_bedroom_1.jpg' },
        { id: '102', name: 'Standard Unit B', type: 'Standard Room', price: 1500, capacity: 2, available: false, image: '/webete_bedroom_1.jpg' },
        { id: '201', name: 'Deluxe Lake View', type: 'Deluxe Room', price: 2150, capacity: 2, available: true, image: '/deluxe_room_2.webp' },
        { id: '202', name: 'Executive Suite', type: 'Executive Suite', price: 3450, capacity: 2, available: true, image: '/webete_bedroom_3.jpg' },
        { id: '301', name: 'Family Villa', type: 'Family Suite', price: 4200, capacity: 4, available: true, image: '/executive_suite_1774779542015.png' },
      ],

      toggleRoomAvailability: async (id) => {
        const room = get().rooms.find(r => r.id === id);
        if (room && isSupabaseConfigured) {
          const { error } = await supabase.from('rooms').update({ available: !room.available }).eq('id', id);
          if (error) console.error('toggleRoomAvailability error:', error.message);
        }
        set((state) => ({
          rooms: state.rooms.map(r => r.id === id ? { ...r, available: !r.available } : r),
        }));
      },

      updateRoomPrice: async (id, price) => {
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('rooms').update({ price }).eq('id', id);
          if (error) console.error('updateRoomPrice error:', error.message);
        }
        set((state) => ({
          rooms: state.rooms.map(r => r.id === id ? { ...r, price } : r),
        }));
      },

      messages: [
        { id: '1', name: 'Abebe Bikila', email: 'abebe@example.com', subject: 'Room Service Hours', message: 'Is room service available 24/7?', read: true, createdAt: new Date().toISOString() },
      ],

      addMessage: async (msgData) => {
        const newMsg: Message = {
          ...msgData,
          id: String(Date.now()),
          read: false,
          createdAt: new Date().toISOString(),
        };
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('messages').insert([{
            id: newMsg.id,
            name: newMsg.name,
            email: newMsg.email,
            subject: newMsg.subject,
            message: newMsg.message,
            read: newMsg.read,
            created_at: newMsg.createdAt,
          }]);
          if (error) console.error('addMessage error:', error.message);
        }
        set((state) => ({ messages: [newMsg, ...state.messages] }));
      },

      markMessageAsRead: async (id) => {
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('messages').update({ read: true }).eq('id', id);
          if (error) console.error('markMessageAsRead error:', error.message);
        }
        set((state) => ({
          messages: state.messages.map(m => m.id === id ? { ...m, read: true } : m),
        }));
      },
    }),
    {
      name: 'wubete-hotel-storage',
      // Only persist UI state — never persist auth credentials or passwords
      partialize: (state) => ({
        isLockdownActive: state.isLockdownActive,
        rooms: state.rooms,
        bookings: state.bookings,
        messages: state.messages,
      }),
    }
  )
);
