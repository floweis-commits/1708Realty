import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

export default async function TenantWorkOrders() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("work_orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="label-md text-secondary">Work Orders</h1>
        <Link href="/tenant/work-orders/new" className="btn-primary">New Request</Link>
      </div>
      <div className="shell">
        {(!orders || orders.length === 0) ? (
          <div className="p-12 body-sm text-secondary">No work orders yet.</div>
        ) : (
          <ul>
            {orders.map((o) => (
              <li key={o.id} className="flex items-center gap-8 px-8 py-6 border-b border-line last:border-0">
                <span className="label-md text-secondary w-48">{o.category}</span>
                <span className="flex-1 text-ink">{o.title}</span>
                <StatusBadge status={o.status} />
                <span className="label-md text-secondary w-32 text-right">
                  {new Date(o.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
