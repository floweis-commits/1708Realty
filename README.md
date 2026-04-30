# 1708 Realty

Lightweight property management portal — single landlord, single tenant.

## Stack
Next.js 14 (App Router) · Supabase (Auth + Postgres + RLS) · Stripe (subscription) · Tailwind CSS.

## Setup

1. `npm install`
2. Copy `.env.example` → `.env.local` and fill in Supabase + Stripe keys.
3. In Supabase SQL editor, run `supabase/schema.sql`.
4. In Supabase Auth → Providers → Email, disable "Confirm email".
5. In Supabase Auth → Users, create both accounts (landlord + tenant). Then in the `profiles` table, insert a row for each with the matching `id` and `role` (`'landlord'` or `'tenant'`).
6. Create a Stripe recurring product, copy the Price ID to `STRIPE_PRICE_ID`.
7. Create the webhook endpoint at `/api/webhooks/stripe` listening for `customer.subscription.*` and `invoice.payment_*`, copy signing secret to `STRIPE_WEBHOOK_SECRET`.
8. `npm run dev`

For local Stripe webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

## Deploy
Push to Vercel, set the same env vars in the project settings.
