import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

export default async function LandlordWorkOrders() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("work_orders").select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      <h1 className="label-md text-secondary">All Work Orders</h1>
      <div className="shell">
        {(!orders || orders.length === 0) ? (
          <div className="p-12 body-sm text-secondary">No work orders.</div>
        ) : (
          <ul>
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/landlord/work-orders/${o.id}`} className="flex items-center gap-8 px-8 py-6 border-b border-line last:border-0 hover:bg-stone-50">
                  <span className="label-md text-secondary w-48">{o.category}</span>
                  <span className="flex-1 text-ink">{o.title}</span>
                  <StatusBadge status={o.status} />
                  <span className="label-md text-secondary w-32 text-right">
                    {new Date(o.created_at).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
