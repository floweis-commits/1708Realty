import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const statusConfig: Record<string, { label: string; bar: string; text: string }> = {
  submitted:     { label: "Submitted",   bar: "bg-[#D6D3D1]", text: "text-secondary" },
  "in progress": { label: "In Progress", bar: "bg-accent",    text: "text-accent" },
  vendor:        { label: "With Vendor", bar: "bg-ink",       text: "text-ink" },
  completed:     { label: "Completed",   bar: "bg-ink",       text: "text-ink" },
  closed:        { label: "Closed",      bar: "bg-[#D6D3D1]", text: "text-secondary" },
};

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

      {(!orders || orders.length === 0) ? (
        <div className="shell p-12 body-sm text-secondary">No work orders yet.</div>
      ) : (
        <div className="shell">
          <div className="flex items-center gap-8 px-8 py-4 border-b border-line">
            <span className="label-md text-secondary w-4" />
            <span className="label-md text-secondary w-28">Category</span>
            <span className="label-md text-secondary flex-1">Description</span>
            <span className="label-md text-secondary w-24 text-right">Submitted</span>
            <span className="label-md text-secondary w-28 text-right">Status</span>
          </div>
          <ul>
            {orders.map((o) => {
              const cfg = statusConfig[o.status?.toLowerCase()] ?? statusConfig.submitted;
              return (
                <li key={o.id} className="flex items-center gap-8 px-8 py-5 border-b border-line last:border-0 hover:bg-stone-50 transition-colors">
                  <div className={`w-1 h-8 rounded-full flex-shrink-0 ${cfg.bar}`} />
                  <span className="label-md text-secondary w-28">{o.category}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink font-medium truncate">{o.title}</div>
                    {o.description && (
                      <div className="body-sm text-secondary truncate mt-0.5">{o.description}</div>
                    )}
                  </div>
                  <span className="label-md text-secondary w-24 text-right flex-shrink-0">
                    {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className={`label-md w-28 text-right flex-shrink-0 ${cfg.text}`}>
                    {cfg.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
