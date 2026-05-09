import { createServiceClient } from "@/lib/supabase/server";

type PaymentRow = {
  id: string;
  amount: number | null;
  status: string;
  current_period_end: string | null;
  created_at: string;
  tenant: { full_name: string | null; email: string | null } | null;
};

const statusConfig: Record<string, { label: string; classes: string }> = {
  active:     { label: "Active",    classes: "text-ink bg-[#E6FF1A]" },
  past_due:   { label: "Past Due",  classes: "text-white bg-accent" },
  canceled:   { label: "Canceled",  classes: "text-secondary bg-[#D6D3D1]" },
  incomplete: { label: "Incomplete",classes: "text-white bg-accent" },
};

export default async function LandlordBilling() {
  const service = createServiceClient();
  const { data: payments } = await service
    .from("payments")
    .select("id,amount,status,current_period_end,created_at,tenant:profiles!payments_tenant_id_fkey(full_name,email)")
    .order("created_at", { ascending: false });

  const rows = (payments ?? []) as PaymentRow[];
  const totalActive = rows
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  return (
    <div className="space-y-12">
      <h1 className="label-md text-secondary">Receivables</h1>

      {/* Summary stat */}
      {rows.length > 0 && (
        <div className="shell p-10 flex items-end justify-between">
          <div>
            <div className="label-md text-secondary mb-3">Monthly Recurring</div>
            <div className="text-5xl font-medium tracking-tight text-ink">
              ${(totalActive / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <div className="label-md text-secondary mb-1">{rows.length} subscription{rows.length !== 1 ? "s" : ""}</div>
            <div className="label-md text-secondary">
              {rows.filter((p) => p.status === "active").length} active
            </div>
          </div>
        </div>
      )}

      {/* Ledger */}
      <div className="shell">
        {rows.length === 0 ? (
          <div className="p-12 body-sm text-secondary">No payment records.</div>
        ) : (
          <>
            <div className="flex items-center gap-8 px-8 py-4 border-b border-line">
              <span className="label-md text-secondary flex-1">Tenant</span>
              <span className="label-md text-secondary w-32 text-right">Amount</span>
              <span className="label-md text-secondary w-28 text-right">Status</span>
              <span className="label-md text-secondary w-36 text-right">Next Due</span>
              <span className="label-md text-secondary w-28 text-right">Received</span>
            </div>
            <ul>
              {rows.map((p) => {
                const cfg = statusConfig[p.status] ?? { label: p.status, classes: "text-secondary bg-[#D6D3D1]" };
                return (
                  <li key={p.id} className="flex items-center gap-8 px-8 py-5 border-b border-line last:border-0 hover:bg-stone-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink font-medium">
                        {p.tenant?.full_name ?? p.tenant?.email ?? "Tenant"}
                      </div>
                      {p.tenant?.full_name && p.tenant?.email && (
                        <div className="body-sm text-secondary mt-0.5">{p.tenant.email}</div>
                      )}
                    </div>
                    <span className="w-32 text-right text-sm font-medium text-ink">
                      {p.amount
                        ? `$${(p.amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        : "—"}
                    </span>
                    <span className="w-28 text-right">
                      <span className={`label-md px-2 py-1 ${cfg.classes}`}>{cfg.label}</span>
                    </span>
                    <span className="label-md text-secondary w-36 text-right">
                      {p.current_period_end
                        ? new Date(p.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </span>
                    <span className="label-md text-secondary w-28 text-right">
                      {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
