import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

type PaymentRow = {
  id: string;
  amount: number | null;
  status: string;
  current_period_end: string | null;
  tenant: { full_name: string | null; email: string | null } | null;
};

const paymentBadgeStatus: Record<string, string> = {
  active: "In Progress",
  past_due: "Completed",
};

export default async function LandlordBilling() {
  const supabase = createClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("id,amount,status,current_period_end,tenant:profiles!payments_tenant_id_fkey(full_name,email)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      <h1 className="label-md text-secondary">Tenant Billing</h1>
      <div className="shell">
        {(!payments || payments.length === 0) ? (
          <div className="p-12 body-sm text-secondary">No payment records.</div>
        ) : (
          <ul>
            {(payments as PaymentRow[]).map((p) => (
              <li key={p.id} className="flex items-center gap-8 px-8 py-6 border-b border-line last:border-0">
                <span className="flex-1 text-ink">{p.tenant?.full_name ?? p.tenant?.email ?? "Tenant"}</span>
                <span className="label-md text-secondary">${((p.amount ?? 0) / 100).toFixed(2)}</span>
                <StatusBadge status={paymentBadgeStatus[p.status] ?? "Closed"} />
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
