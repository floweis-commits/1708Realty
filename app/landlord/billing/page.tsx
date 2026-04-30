import { createClient } from "@/lib/supabase/server";

export default async function LandlordBilling() {
  const supabase = createClient();
  const { data: payments } = await supabase
    .from("payments").select("*, tenant:profiles!payments_tenant_id_fkey(full_name,email)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      <h1 className="label-md text-secondary">Tenant Billing</h1>
      <div className="shell">
        {(!payments || payments.length === 0) ? (
          <div className="p-12 body-sm text-secondary">No payment records.</div>
        ) : (
          <ul>
            {payments.map((p: any) => (
              <li key={p.id} className="flex items-center gap-8 px-8 py-6 border-b border-line last:border-0">
                <span className="flex-1 text-ink">{p.tenant?.full_name ?? p.tenant?.email ?? "Tenant"}</span>
                <span className="label-md text-secondary">${((p.amount ?? 0) / 100).toFixed(2)}</span>
                <span className={`badge ${p.status === "active" ? "badge-progress" : p.status === "past_due" ? "badge-completed" : "badge-closed"}`}>{p.status}</span>
                <span className="label-md text-secondary w-40 text-right">
                  {p.current_period_end ? new Date(p.current_period_end).toLocaleDateString() : "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
