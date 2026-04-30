import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LandlordDashboard() {
  const supabase = createClient();
  const { data: orders } = await supabase.from("work_orders").select("id,status");
  const open = orders?.filter((o) => o.status !== "Completed" && o.status !== "Closed").length ?? 0;

  const { data: payment } = await supabase
    .from("payments").select("status,current_period_end")
    .order("created_at", { ascending: false }).limit(1).maybeSingle();

  return (
    <div className="space-y-12">
      <h1 className="label-md text-secondary">Landlord — Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/landlord/work-orders" className="shell p-12 block hover:bg-stone-50 transition-colors">
          <div className="label-md text-secondary mb-6">Open Work Orders</div>
          <div className="text-4xl text-ink font-medium tracking-tight">{open}</div>
          <div className="body-sm mt-4">{orders?.length ?? 0} total</div>
        </Link>
        <Link href="/landlord/billing" className="shell p-12 block hover:bg-stone-50 transition-colors">
          <div className="label-md text-secondary mb-6">Tenant Payment</div>
          <div className="text-4xl text-ink font-medium tracking-tight">{payment?.status ?? "—"}</div>
          {payment?.current_period_end && (
            <div className="body-sm mt-4">Next: {new Date(payment.current_period_end).toLocaleDateString()}</div>
          )}
        </Link>
      </div>
    </div>
  );
}
