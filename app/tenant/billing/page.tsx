import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export default async function TenantBilling({ searchParams }: { searchParams: { success?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const service = createServiceClient();
  const { data: payment } = await service
    .from("payments").select("*").eq("tenant_id", user!.id)
    .order("created_at", { ascending: false }).limit(1).maybeSingle();

  return (
    <div className="space-y-12">
      <h1 className="label-md text-secondary">Billing</h1>
      {searchParams.success && <div className="shell p-6 body-sm text-ink">Payment confirmed. Thank you.</div>}
      <div className="shell p-12 space-y-6">
        <div className="label-md text-secondary">Subscription</div>
        <div className="text-4xl text-ink font-medium tracking-tight">{payment?.status ?? "Not started"}</div>
        {payment?.current_period_end && <div className="body-sm">Next payment: {new Date(payment.current_period_end).toLocaleDateString()}</div>}
        {payment?.amount && <div className="body-sm">Amount: ${(payment.amount/100).toFixed(2)} / month</div>}
      </div>
      <div className="flex gap-8">
        {!payment || payment.status === "canceled" || payment.status === "incomplete"
          ? <form action="/api/checkout" method="post"><button className="btn-primary">Pay Rent</button></form>
          : <form action="/api/portal" method="post"><button className="btn-secondary">Manage Card</button></form>}
      </div>
    </div>
  );
}
