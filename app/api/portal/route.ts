import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const service = createServiceClient();
  const { data: payment } = await service.from("payments").select("stripe_customer_id").eq("tenant_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!payment?.stripe_customer_id) return NextResponse.json({ error: "No customer" }, { status: 400 });
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const portal = await stripe.billingPortal.sessions.create({ customer: payment.stripe_customer_id, return_url: `${site}/tenant/billing` });
  return NextResponse.redirect(portal.url, 303);
}
