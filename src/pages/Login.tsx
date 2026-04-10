import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotelStore } from '../store/useHotelStore';
import { Lock, ArrowRight, Mail, AlertTriangle, CheckCircle2, Timer } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const LOCKOUT_KEY = 'wubete_login_lockout';
const ATTEMPTS_KEY = 'wubete_login_attempts';

type LoginView = 'login' | 'forgot' | 'forgot-sent';

export default function Login() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<LoginView>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Rate limiting state
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const login = useHotelStore(state => state.login);
  const navigate = useNavigate();

  // Load lockout state from sessionStorage on mount
  useEffect(() => {
    const storedLockout = sessionStorage.getItem(LOCKOUT_KEY);
    const storedAttempts = sessionStorage.getItem(ATTEMPTS_KEY);
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout, 10);
      if (lockoutTime > Date.now()) {
        setLockoutUntil(lockoutTime);
      } else {
        sessionStorage.removeItem(LOCKOUT_KEY);
        sessionStorage.removeItem(ATTEMPTS_KEY);
      }
    }
    if (storedAttempts) setAttempts(parseInt(storedAttempts, 10));
  }, []);

  // Countdown timer during lockout
  useEffect(() => {
    if (!lockoutUntil) return;
    const tick = () => {
      const remaining = lockoutUntil - Date.now();
      if (remaining <= 0) {
        setLockoutUntil(null);
        setAttempts(0);
        sessionStorage.removeItem(LOCKOUT_KEY);
        sessionStorage.removeItem(ATTEMPTS_KEY);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.ceil(remaining / 1000));
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLockedOut = lockoutUntil !== null && lockoutUntil > Date.now();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setLoading(true);
    setError('');

    const success = await login(code);
    setLoading(false);

    if (success) {
      sessionStorage.removeItem(LOCKOUT_KEY);
      sessionStorage.removeItem(ATTEMPTS_KEY);
      navigate('/admin');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      sessionStorage.setItem(ATTEMPTS_KEY, String(newAttempts));

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutUntil(lockoutTime);
        sessionStorage.setItem(LOCKOUT_KEY, String(lockoutTime));
        setError('');
      } else {
        setError(`Invalid access code. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts === 1 ? '' : 's'} remaining.`);
      }
      setCode('');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setForgotError('Password reset requires Supabase to be configured.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/admin/login`,
    });

    setForgotLoading(false);
    if (resetError) {
      setForgotError('Could not send reset email. Please check the email address.');
    } else {
      setView('forgot-sent');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full -mr-20 -mt-20" />

        {/* ── LOGIN FORM ── */}
        {view === 'login' && (
          <>
            <div className="text-center mb-6 relative z-10">
              <div className="w-14 h-14 bg-brand-burgundy/5 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <Lock className="w-7 h-7 text-brand-burgundy" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-[#2d1115] mb-2 tracking-tight">Admin Portal</h1>
              <p className="text-gray-500 font-medium text-sm">Enter your access code to manage Webeté reservations.</p>
            </div>

            {/* Lockout Banner */}
            {isLockedOut && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 relative z-10">
                <Timer className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700">Account Temporarily Locked</p>
                  <p className="text-xs text-red-600 mt-1">
                    Too many failed attempts. Try again in <span className="font-bold">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold text-[#2d1115] uppercase tracking-wider mb-2">Access Code</label>
                <input
                  type="password"
                  id="admin-access-code"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(''); }}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all font-mono tracking-widest text-[#2d1115] disabled:opacity-50"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isLockedOut || loading}
                />
                {error && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-red-500 text-sm font-semibold">{error}</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                id="admin-login-btn"
                disabled={isLockedOut || loading}
                className="w-full bg-[#2d1115] text-[#fefaf0] px-6 py-3.5 rounded-2xl hover:bg-[#c4a484] hover:text-[#2d1115] transition-all duration-300 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <>Authenticate <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mt-5 relative z-10">
              <button
                onClick={() => { setView('forgot'); setError(''); }}
                className="text-xs text-gray-400 hover:text-brand-burgundy transition-colors font-semibold uppercase tracking-widest"
              >
                Forgot password?
              </button>
            </div>
          </>
        )}

        {/* ── FORGOT PASSWORD FORM ── */}
        {view === 'forgot' && (
          <>
            <div className="text-center mb-6 relative z-10">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-brand-burgundy" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-[#2d1115] mb-2 tracking-tight">Reset Password</h1>
              <p className="text-gray-500 font-medium text-sm">Enter your admin email and we'll send a reset link.</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold text-[#2d1115] uppercase tracking-wider mb-2">Admin Email</label>
                <input
                  type="email"
                  id="admin-reset-email"
                  value={forgotEmail}
                  onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all text-[#2d1115]"
                  placeholder="admin@webetehotel.com"
                  required
                  autoComplete="email"
                  disabled={forgotLoading}
                />
                {forgotError && (
                  <p className="text-red-500 text-sm mt-2 font-semibold">{forgotError}</p>
                )}
              </div>

              <button
                type="submit"
                id="admin-reset-btn"
                disabled={forgotLoading}
                className="w-full bg-[#2d1115] text-[#fefaf0] px-6 py-3.5 rounded-2xl hover:bg-[#c4a484] hover:text-[#2d1115] transition-all duration-300 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
              >
                {forgotLoading ? (
                  <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <>Send Reset Link <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full text-center text-xs text-gray-400 hover:text-brand-burgundy transition-colors font-semibold uppercase tracking-widest py-1"
              >
                ← Back to Login
              </button>
            </form>
          </>
        )}

        {/* ── RESET EMAIL SENT ── */}
        {view === 'forgot-sent' && (
          <div className="text-center relative z-10 py-4">
            <div className="w-14 h-14 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#2d1115] mb-3">Check Your Email</h2>
            <p className="text-gray-500 text-sm font-medium mb-6">
              If <span className="font-bold text-[#2d1115]">{forgotEmail}</span> is registered, you'll receive a password reset link shortly.
            </p>
            <button
              onClick={() => { setView('login'); setForgotEmail(''); }}
              className="text-xs text-brand-burgundy hover:text-brand-gold transition-colors font-black uppercase tracking-widest"
            >
              ← Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
