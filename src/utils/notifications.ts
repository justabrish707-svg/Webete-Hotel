// All notification calls (Telegram, email) now go through Supabase Edge Functions.
// API keys NEVER leave the server — they are not in the JS bundle.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface BookingPayload {
  guestName: string;
  email: string;
  phone: string;
  roomType: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
}

/**
 * Create a "pay at hotel" booking server-side via Edge Function.
 * The server validates input, calculates the price from DB, saves the booking,
 * and sends all notifications (Telegram + Email) — secrets stay server-side.
 */
export const createBookingAndNotify = async (
  payload: BookingPayload
): Promise<{ success: boolean; bookingId?: string; amount?: number; error?: string }> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: (err as { error?: string }).error || 'Booking service unavailable.' };
    }

    return await response.json();
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error. Please try again.' };
  }
};

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends a contact inquiry via Edge Function.
 * Saves to DB and alerts admin via Telegram server-side.
 */
export const sendContactInquiry = async (
  payload: ContactPayload
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: (err as { error?: string }).error || 'Messaging service unavailable.' };
    }

    return await response.json();
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error. Please try again.' };
  }
};

// Legacy stubs — notifications are now handled entirely by Edge Functions.
// These are kept for any remaining import references and are safe no-ops.
export const sendTelegramNotification = async (): Promise<boolean> => true;
export const sendEmailConfirmation = async (): Promise<boolean> => true;
