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
    const { guestName, email, phone, roomId, roomType, checkIn, checkOut, guests, specialRequests } = await req.json();

    // --- Input Validation ---
    if (!guestName || !email || !phone || !roomId || !checkIn || !checkOut) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email address.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (checkInDate < today || checkOutDate <= checkInDate) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid date range.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Get room from DB and re-calculate price server-side ---
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data: room, error: roomError } = await supabase
      .from('rooms').select('price, available, name').eq('id', roomId).single();

    if (roomError || !room) {
      return new Response(JSON.stringify({ success: false, error: 'Room not found.' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!room.available) {
      return new Response(JSON.stringify({ success: false, error: 'Room is no longer available.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Server-side amount calculation
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const subtotal = room.price * nights;
    const serviceCharge = subtotal * 0.05;
    const vat = (subtotal + serviceCharge) * 0.05;
    const amount = Math.round(subtotal + serviceCharge + vat);

    // --- Create booking in DB ---
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const finalRoomType = roomType || room.name;

    const { error: insertError } = await supabase.from('bookings').insert([{
      id: bookingId,
      guest_name: String(guestName).slice(0, 100),
      email: String(email).slice(0, 200),
      phone: String(phone).slice(0, 30),
      check_in: checkIn,
      check_out: checkOut,
      room_type: String(finalRoomType).slice(0, 100),
      guests: Math.min(Math.max(1, Number(guests) || 1), 10),
      special_requests: String(specialRequests || '').slice(0, 500),
      status: 'Pending',
      amount,
      created_at: new Date().toISOString(),
    }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ success: false, error: 'Failed to save booking: ' + JSON.stringify(insertError) }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log event (optional, don't crash if it fails)
    try {
      await supabase.from('system_logs').insert([{
        event_type: 'booking_created_pay_at_hotel',
        payload: { bookingId, guestName, email, amount },
      }]);
    } catch (e) {
      console.error('System log error:', e);
    }

    // Send notifications (server-side — keys stay private)
    await sendTelegramAlert({ guestName, email, phone, roomType: finalRoomType, checkIn, checkOut, amount });
    await sendEmails({ guestName, email, roomType: finalRoomType, checkIn, checkOut, amount });

    return new Response(JSON.stringify({ success: true, bookingId, amount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('send-notification error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Internal error: ' + (err instanceof Error ? err.stack : String(err)) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function escape(str: any) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sendTelegramAlert(b: Record<string, any>) {
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
  
  if (!botToken || !chatId) {
    console.warn('Telegram notification skipped: Bot token or Chat ID not configured.');
    return;
  }

  const msg = `
🏨 <b>New Booking — Pay at Hotel</b>
👤 <b>Guest:</b> ${escape(b.guestName)}
📧 <b>Email:</b> ${escape(b.email)}
📞 <b>Phone:</b> <code>${escape(b.phone)}</code>
🛏️ <b>Room:</b> ${escape(b.roomType)}
📅 <b>Stay:</b> ${b.checkIn} → ${b.checkOut}
💰 <b>Amount:</b> ${Number(b.amount).toLocaleString()} ETB
`.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' }),
    });
    if (!res.ok) console.error('Telegram API error:', await res.text());
    else console.log('Telegram message sent successfully!');
  } catch (err) {
    console.error('Telegram fetch error:', err);
  }
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
      subject: `New Booking: ${b.guestName} — Pay at Hotel`,
      html: `<h1>New Booking Request</h1><p><b>Guest:</b> ${b.guestName}</p><p><b>Room:</b> ${b.roomType}</p><p><b>Dates:</b> ${b.checkIn} – ${b.checkOut}</p><p><b>Expected Amount:</b> ${Number(b.amount).toLocaleString()} ETB</p><p><b>Payment:</b> On Arrival</p>`,
    }),
  }).catch(() => {});

  await fetch('https://api.resend.com/emails', {
    method: 'POST', headers,
    body: JSON.stringify({
      from, to: b.email as string,
      subject: 'Booking Received — Wubeté Hotel',
      html: `<div style="font-family:serif;color:#1a0a0c"><h1 style="color:#c4a484">Welcome to the Wubeté Legacy</h1><p>Dear ${b.guestName},</p><p>Your reservation at <b>Arba Minch Wubeté Hotel</b> has been received. Our concierge will contact you shortly.</p><p><b>Room:</b> ${b.roomType}<br><b>Check-in:</b> ${b.checkIn}<br><b>Check-out:</b> ${b.checkOut}<br><b>Due on Arrival:</b> ${Number(b.amount).toLocaleString()} ETB</p><p>We look forward to welcoming you!</p></div>`,
    }),
  }).catch(() => {});
}
