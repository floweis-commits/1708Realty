import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature"); const body = await req.text();
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!); }
  catch (err: any) { return NextResponse.json({ error: `Webhook: ${err.message}` }, { status: 400 }); }
  const service = createServiceClient();
  async function upsertSubscription(sub: Stripe.Subscription) {
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const customer = await stripe.customers.retrieve(customerId);
    const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
    if (!userId) return;
    const item = sub.items.data[0];
    await service.from("payments").upsert({
      tenant_id: userId, stripe_customer_id: customerId, stripe_sub_id: sub.id,
      amount: item?.price.unit_amount ?? null, status: sub.status,
      current_period_end: new Date(sub.current_period_end*1000).toISOString(),
    }, { onConflict: "stripe_sub_id" });
  }
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await upsertSubscription(event.data.object as Stripe.Subscription); break;
    case "invoice.payment_succeeded":
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
        await upsertSubscription(sub);
      }
      break;
    }
  }
  return NextResponse.json({ received: true });
}
