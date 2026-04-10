// All Chapa API calls now go through our Supabase Edge Functions.
// Secret keys NEVER leave the server.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Generate a unique transaction reference (safe — no secret key needed)
 */
export const generateTxRef = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WUBETE-${timestamp}-${random}`;
};

/**
 * Initialize a Chapa payment via Edge Function (secret key stays server-side)
 */
export const initializeChapaPayment = async (params: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  txRef: string;
  roomType: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
}): Promise<{ success: boolean; checkoutUrl?: string; calculatedAmount?: number; error?: string }> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/chapa-init`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: (err as { error?: string }).error || 'Payment service unavailable.' };
    }

    return await response.json();
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Verify a Chapa payment via Edge Function + create booking in DB server-side
 */
export const verifyChapaPayment = async (
  txRef: string,
  pendingBooking?: Record<string, unknown>
): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/chapa-verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txRef, pendingBooking }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: (err as { error?: string }).error || 'Verification failed.' };
    }

    return await response.json();
  } catch {
    return { success: false, error: 'Verification failed. Please contact support.' };
  }
};
