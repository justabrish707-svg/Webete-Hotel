---
description: Deploy Supabase Edge Functions and set secrets after security hardening
---

## Step 1 — Install Supabase CLI (if not installed)
```
npm install -g supabase
```

## Step 2 — Login to Supabase CLI
```
supabase login
```

## Step 3 — Link your project
```
supabase link --project-ref sptbdixvcrfyiotgrxoe
```

## Step 4 — Set secrets (these replace the removed VITE_ keys)
// turbo
```
supabase secrets set CHAPA_SECRET_KEY=CHASECK_TEST-H10XLIm3niO4qsGl6uXY5Ggs1Zy0Ixl1
supabase secrets set RESEND_API_KEY=re_Lbg75qat_26xadug3d7QYoDSxcSK62Cwt
supabase secrets set TELEGRAM_BOT_TOKEN=8634269980:AAG2V4aU3rSh9wPfP2XhTEjLWxFwKevzCJE
supabase secrets set TELEGRAM_CHAT_ID=5803816508
supabase secrets set HOTEL_EMAIL=justabrish707@gmail.com
```

## Step 5 — Deploy the Edge Functions
// turbo
```
supabase functions deploy chapa-init
supabase functions deploy chapa-verify
supabase functions deploy send-notification
```

## Step 6 — Run the security SQL migration
Go to: https://supabase.com/dashboard/project/sptbdixvcrfyiotgrxoe/sql
Paste and run the contents of: supabase/migrations/20260407_security_improvements.sql

## Step 7 — Deploy the site to Vercel (picks up vercel.json security headers)
```
vercel --prod
```
