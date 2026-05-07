# 1708 Realty

Lightweight property management portal — single landlord, single tenant.

## Stack
Next.js 14 (App Router) · Supabase (Auth + Postgres + RLS) · Stripe (subscription) · Tailwind CSS.

## Setup

1. `npm install`
2. Copy `.env.example` → `.env.local` and fill in Supabase + Stripe keys.
3. In Supabase SQL editor, run `supabase/schema.sql`.
4. In Supabase Auth → Providers → Email, disable "Confirm email".
5. Create landlord + tenant accounts in Supabase Auth → Users; insert matching rows in `profiles` with role.
6. Create a Stripe recurring product, copy Price ID to `STRIPE_PRICE_ID`.
7. Create the webhook at `/api/webhooks/stripe` listening for `customer.subscription.*` and `invoice.payment_*`.
8. `npm run dev`
