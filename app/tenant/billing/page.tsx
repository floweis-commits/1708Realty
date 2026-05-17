import { createClient } from "@/lib/supabase/server";

const statusLabel: Record<string, string> = {
  active: "Active",
  past_due: "Past Due",
  canceled: "Canceled",
  incomplete: "Incomplete",
  trialing: "Trialing",
};

const statusColor: Record<string, string> = {
  active: "text-ink bg-[#E6FF1A]",
  past_due: "text-white bg-accent",
  canceled: "text-secondary bg-[#D6D3D1]",
  incomplete: "text-white bg-accent",
};

export default async function TenantBilling({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("tenant_id", user!.id)
    .order("created_at", { ascending: false });

  const latest = payments?.[0] ?? null;
  const isActive =
    latest && latest.status !== "canceled" && latest.status !== "incomplete";

  return (
    <div className="space-y-12">
      <h1 className="label-md text-secondary">Billing</h1>

      {success && (
        <div className="shell px-8 py-5 body-sm text-ink border-l-2 border-accent">
          Payment confirmed — you&apos;re all set.
        </div>
      )}

      <div className="shell p-10 space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="label-md text-secondary mb-3">Monthly Rent</div>
            <div className="text-5xl font-medium tracking-tight text-ink">
              {latest?.amount
                ? `$${(latest.amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                : "—"}
            </div>
          </div>
          {latest && (
            <span className={`label-md px-3 py-1.5 ${statusColor[latest.status] ?? "text-secondary bg-[#D6D3D1]"}`}>
              {statusLabel[latest.status] ?? latest.status}
            </span>
          )}
        </div>

        {latest?.current_period_end && (
          <div className="pt-4 border-t border-line flex items-center justify-between">
            <span className="label-md text-secondary">Next payment due</span>
            <span className="label-md text-ink">
              {new Date(latest.current_period_end).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        <div className="flex gap-8 pt-2">
          {!isActive ? (
            <form action="/api/checkout" method="post">
              <button className="btn-primary">Pay Rent</button>
            </form>
          ) : (
            <form action="/api/portal" method="post">
              <button className="btn-secondary">Manage Payment Method</button>
            </form>
          )}
        </div>
      </div>

      {payments && payments.length > 0 && (
        <div className="space-y-4">
          <div className="label-md text-secondary">Payment History</div>
          <div className="shell">
            <div className="flex items-center gap-8 px-8 py-4 border-b border-line">
              <span className="label-md text-secondary flex-1">Date</span>
              <span className="label-md text-secondary w-36 text-right">Amount</span>
              <span className="label-md text-secondary w-28 text-right">Status</span>
            </div>
            <ul>
              {payments.map((p) => (
                <li key={p.id} className="flex items-center gap-8 px-8 py-5 border-b border-line last:border-0">
                  <span className="flex-1 text-ink text-sm">
                    {new Date(p.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="w-36 text-right text-sm font-medium text-ink">
                    {p.amount
                      ? `$${(p.amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      : "—"}
                  </span>
                  <span className="w-28 text-right">
                    <span className={`label-md px-2 py-1 ${statusColor[p.status] ?? "text-secondary bg-[#D6D3D1]"}`}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
