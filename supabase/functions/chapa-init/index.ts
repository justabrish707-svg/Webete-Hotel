// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, phone, txRef, roomType, roomId, checkIn, checkOut } = await req.json();

    // --- Input Validation ---
    if (!email || !firstName || !txRef || !roomId || !checkIn || !checkOut || !phone) {
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
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid dates.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (checkInDate < today) {
      return new Response(JSON.stringify({ success: false, error: 'Check-in cannot be in the past.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (checkOutDate <= checkInDate) {
      return new Response(JSON.stringify({ success: false, error: 'Check-out must be after check-in.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Fetch authoritative room price from DB ---
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

    // --- Server-side price calculation (never trust client amount) ---
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const subtotal = room.price * nights;
    const serviceCharge = subtotal * 0.05;
    const vat = (subtotal + serviceCharge) * 0.05;
    const calculatedAmount = Math.round(subtotal + serviceCharge + vat);

    // --- Call Chapa with SECRET key (safe — server-side only) ---
    const chapaSecretKey = Deno.env.get('CHAPA_SECRET_KEY');
    if (!chapaSecretKey) {
      return new Response(JSON.stringify({ success: false, error: 'Payment gateway not configured.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const origin = req.headers.get('origin') || 'https://arbaminch-wubete.vercel.app';
    const returnUrl = `${origin}/payment/callback?tx_ref=${txRef}`;

    const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${chapaSecretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: calculatedAmount, currency: 'ETB', email,
        first_name: firstName, last_name: lastName, phone_number: phone,
        tx_ref: txRef, callback_url: returnUrl, return_url: returnUrl,
        customization: {
          title: 'Arba Minch Wubeté Hotel',
          description: `${roomType || room.name} · ${checkIn} to ${checkOut}`,
        },
      }),
    });

    const chapaData = await chapaRes.json();

    if (chapaData.status === 'success' && chapaData.data?.checkout_url) {
      return new Response(JSON.stringify({
        success: true,
        checkoutUrl: chapaData.data.checkout_url,
        calculatedAmount,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: false, error: chapaData.message || 'Payment initialization failed.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('chapa-init error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
