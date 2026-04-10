import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { txRef, pendingBooking } = await req.json();
    if (!txRef) {
      return new Response(JSON.stringify({ success: false, error: 'Transaction reference required.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const chapaSecretKey = Deno.env.get('CHAPA_SECRET_KEY');
    if (!chapaSecretKey) {
      return new Response(JSON.stringify({ success: false, error: 'Payment gateway not configured.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Verify with Chapa (server-side — secret key stays private) ---
    const chapaRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      headers: { 'Authorization': `Bearer ${chapaSecretKey}` },
    });
    const chapaData = await chapaRes.json();

    if (chapaData.status !== 'success' || chapaData.data?.status !== 'success') {
      return new Response(JSON.stringify({ success: false, error: chapaData.message || 'Payment not verified.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const paymentData = chapaData.data;
    const verifiedAmount = paymentData.amount; // Use Chapa-verified amount — not client value

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // --- Create booking with server-verified amount ---
    if (pendingBooking) {
      const { guestName, email, phone, roomType, checkIn, checkOut, guests, specialRequests } = pendingBooking;

      // Validate pending booking data
      if (!guestName || !email || !checkIn || !checkOut) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid booking data.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      await supabase.from('bookings').insert([{
        id: bookingId,
        guest_name: String(guestName).slice(0, 100),
        email: String(email).slice(0, 200),
        phone: String(phone || '').slice(0, 30),
        check_in: checkIn,
        check_out: checkOut,
        room_type: String(roomType || 'Room').slice(0, 100),
        guests: Math.min(Math.max(1, Number(guests) || 1), 10),
        special_requests: String(specialRequests || '').slice(0, 500),
        status: 'Confirmed',
        amount: verifiedAmount,
        payment_ref: txRef,
        created_at: new Date().toISOString(),
      }]);

      // Log payment event
      await supabase.from('system_logs').insert([{
        event_type: 'payment_verified',
        payload: { txRef, amount: verifiedAmount, guestName, email, bookingId },
      }]).catch(() => {});

      // Send Telegram alert
      await sendTelegramAlert({ guestName, email, phone, roomType, checkIn, checkOut, amount: verifiedAmount }, txRef);
      // Send emails
      await sendEmails({ guestName, email, roomType, checkIn, checkOut, amount: verifiedAmount });
    }

    return new Response(JSON.stringify({ success: true, data: paymentData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('chapa-verify error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Verification failed.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendTelegramAlert(b: Record<string, unknown>, txRef: string) {
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
  if (!botToken || !chatId) return;
  const msg = `🏨 *Payment Confirmed — Wubeté*\n👤 ${b.guestName}\n📧 ${b.email}\n📞 ${b.phone}\n🛏️ ${b.roomType}\n📅 ${b.checkIn} → ${b.checkOut}\n💰 ${Number(b.amount).toLocaleString()} ETB\n🧾 Ref: ${txRef}`;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

async function sendEmails(b: Record<string, unknown>) {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  const hotelEmail = Deno.env.get('HOTEL_EMAIL') || 'justabrish707@gmail.com';
  if (!resendKey) return;

  const headers = { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' };
  const from = 'Arba Minch Wubeté <onboarding@resend.dev>';

  await fetch('https://api.resend.com/emails', {
    method: 'POST', headers,
    body: JSON.stringify({
      from, to: hotelEmail,
      subject: `✅ Confirmed Booking: ${b.guestName}`,
      html: `<h1>Booking Confirmed</h1><p><b>Guest:</b> ${b.guestName}</p><p><b>Room:</b> ${b.roomType}</p><p><b>Dates:</b> ${b.checkIn} – ${b.checkOut}</p><p><b>Amount:</b> ${Number(b.amount).toLocaleString()} ETB (paid via Chapa)</p>`,
    }),
  }).catch(() => {});

  await fetch('https://api.resend.com/emails', {
    method: 'POST', headers,
    body: JSON.stringify({
      from, to: b.email as string,
      subject: 'Booking Confirmed — Wubeté Hotel',
      html: `<div style="font-family:serif;color:#1a0a0c"><h1 style="color:#c4a484">Booking Confirmed!</h1><p>Dear ${b.guestName},</p><p>Your payment has been verified and your stay at <b>Arba Minch Wubeté Hotel</b> is confirmed.</p><p><b>Room:</b> ${b.roomType}<br><b>Check-in:</b> ${b.checkIn}<br><b>Check-out:</b> ${b.checkOut}<br><b>Amount Paid:</b> ${Number(b.amount).toLocaleString()} ETB</p><p>We look forward to welcoming you!</p></div>`,
    }),
  }).catch(() => {});
}
