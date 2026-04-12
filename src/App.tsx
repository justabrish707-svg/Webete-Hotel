import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
const Home = lazy(() => import('./pages/Home'));
const Rooms = lazy(() => import('./pages/Rooms'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Dining = lazy(() => import('./pages/Dining'));
const Services = lazy(() => import('./pages/Services'));
const Activities = lazy(() => import('./pages/Activities'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Booking = lazy(() => import('./pages/Booking'));
const PaymentCallback = lazy(() => import('./pages/PaymentCallback'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
import CustomCursor from './components/CustomCursor';
import { useHotelStore } from './store/useHotelStore';
import TawkChat from './components/TawkChat';
import { supabase, isSupabaseConfigured } from './lib/supabase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useHotelStore(state => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}


function App() {
  const initializeStore = useHotelStore(state => state.initializeStore);
  const logout = useHotelStore(state => state.logout);

  useEffect(() => {
    initializeStore().catch(console.error);
  }, [initializeStore]);

  // 🔒 CRITICAL: Validate Supabase session on every app load.
  // Prevents spoofed isAuthenticated flag in localStorage from granting access.
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Immediately check if there is a valid live session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // No valid session → force logout (clears any stale localStorage flag)
        logout();
      }
    });

    // Subscribe to auth state changes (handles token expiry, sign-outs from other tabs, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        useHotelStore.setState({ isAuthenticated: true });
        useHotelStore.getState().initializeStore().catch(console.error);
      }
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
        useHotelStore.setState({ isAuthenticated: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [logout]);

  const LoadingFallback = () => (
    <div className="fixed inset-0 bg-[#0d0407] flex flex-col items-center justify-center z-50">
      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-brand-gold/30 shadow-2xl bg-brand-burgundy/30 flex items-center justify-center mb-6 animate-pulse">
        <img src="/images/branding/logomark.webp" alt="Wubeté Loading" className="w-full h-full object-contain p-2" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );

  return (
    <Router>
      <CustomCursor />
      <TawkChat />
      <Suspense fallback={<LoadingFallback />}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/rooms" element={<PageTransition><Rooms /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/dining" element={<PageTransition><Dining /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/activities" element={<PageTransition><Activities /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
        <Route path="/payment/callback" element={<PageTransition><PaymentCallback /></PageTransition>} />
        <Route path="/admin/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <PageTransition><Admin /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
