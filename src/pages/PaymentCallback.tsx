import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Phone, Mail } from 'lucide-react';
import Layout from '../components/Layout';
import { verifyChapaPayment } from '../utils/chapa';

type PaymentStatus = 'verifying' | 'success' | 'failed' | 'error';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>('verifying');
  const [paymentData, setPaymentData] = useState<Record<string, unknown> | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref') || '';

  useEffect(() => {
    if (!txRef) {
      setStatus('error');
      setErrorMessage('No transaction reference found.');
      return;
    }

    const verify = async () => {
      // Small delay to allow Chapa to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Retrieve pending booking from sessionStorage
      let pendingBooking: Record<string, unknown> | undefined;
      const pendingRaw = sessionStorage.getItem('pendingBooking');
      if (pendingRaw) {
        try { pendingBooking = JSON.parse(pendingRaw); } catch (err) { console.warn('Failed to parse pending booking:', err); }
      }

      // Edge Function verifies payment AND creates booking + sends notifications server-side
      const result = await verifyChapaPayment(txRef, pendingBooking);

      if (result.success && result.data) {
        setPaymentData(result.data);
        setStatus('success');
        sessionStorage.removeItem('pendingBooking');
      } else {
        setStatus('failed');
        setErrorMessage('Payment could not be verified. Please contact support.');
      }
    };

    verify();
  }, [txRef]);

  return (
    <Layout>
      <section className="min-h-screen bg-gray-50 flex items-center justify-center py-6 px-4">
        <div className="bg-white max-w-lg w-full p-6 md:p-5 rounded-3xl shadow-2xl border border-gray-100 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full -mr-20 -mt-5" />
          <div className="absolute bottom-0 left-0 w-10 h-10 bg-brand-burgundy/5 rounded-full -ml-16 -mb-8" />

          {/* Verifying */}
          {status === 'verifying' && (
            <div className="relative z-10 space-y-6">
              <div className="w-8 h-8 mx-auto bg-yellow-50 rounded-3xl flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Verifying Payment</h2>
              <p className="text-gray-500 font-medium">Please wait while we confirm your payment with Chapa...</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                <span>Transaction: {txRef}</span>
              </div>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="relative z-10 space-y-6">
              <div className="w-8 h-8 mx-auto bg-green-50 rounded-3xl flex items-center justify-center animate-bounce-once">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Payment Successful!</h2>
              <p className="text-gray-500 font-medium">
                Your booking at <span className="text-brand-burgundy font-bold">Arba Minch Wubeté Hotel</span> has been confirmed.
              </p>

              {paymentData && (
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-left space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">Amount Paid</span>
                    <span className="font-black text-green-700">{Number(paymentData.amount).toLocaleString()} {String(paymentData.currency ?? 'ETB')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">Method</span>
                    <span className="font-bold text-gray-900 capitalize">{String(paymentData.method ?? 'Chapa')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">Reference</span>
                    <span className="font-mono text-xs text-gray-600">{String(paymentData.reference ?? txRef)}</span>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border-l-4 border-brand-gold p-4 rounded-xl text-left">
                <p className="text-sm text-brand-burgundy font-medium">
                  📧 A confirmation email has been sent to your email address. Please check your inbox.
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-brand-burgundy text-brand-gold px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg"
              >
                Back to Home <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Failed */}
          {(status === 'failed' || status === 'error') && (
            <div className="relative z-10 space-y-6">
              <div className="w-8 h-8 mx-auto bg-red-50 rounded-3xl flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Payment {status === 'failed' ? 'Failed' : 'Error'}</h2>
              <p className="text-gray-500 font-medium">{errorMessage}</p>

              {txRef && (
                <p className="text-xs text-gray-400 font-mono">Ref: {txRef}</p>
              )}

              <div className="space-y-3 pt-2">
                <Link
                  to="/booking"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-burgundy text-brand-gold px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg"
                >
                  Try Again <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                  <a href={`tel:${import.meta.env.VITE_HOTEL_PHONE}`} className="flex items-center gap-1 hover:text-brand-burgundy transition-colors">
                    <Phone className="w-3.5 h-3.5" /> Call Us
                  </a>
                  <a href={`mailto:${import.meta.env.VITE_HOTEL_EMAIL}`} className="flex items-center gap-1 hover:text-brand-burgundy transition-colors">
                    <Mail className="w-3.5 h-3.5" /> Email Us
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
