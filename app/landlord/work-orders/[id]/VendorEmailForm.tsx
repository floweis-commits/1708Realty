"use client";
import { useState } from "react";

type Vendor = { id: string; name: string; email: string; categories: string[] };
type Order = { id: string; title: string; description: string | null; category: string; image_url: string | null };

export default function VendorEmailForm({ order, vendors }: { order: Order; vendors: Vendor[] }) {
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setSending(true); setError(null);
    const res = await fetch("/api/vendor-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId, orderId: order.id }),
    });
    if (res.ok) { setSent(true); }
    else { const d = await res.json(); setError(d.error ?? "Failed to send"); }
    setSending(false);
  }

  if (vendors.length === 0) return <div className="body-sm text-secondary">No vendors match this category. <a href="/landlord/vendors" className="underline">Add vendors</a></div>;
  if (sent) return <div className="body-sm text-ink">Email sent to vendor.</div>;

  return (
    <div className="space-y-6">
      <select value={vendorId} onChange={e => setVendorId(e.target.value)} className="input-underline bg-transparent">
        {vendors.map(v => <option key={v.id} value={v.id}>{v.name} — {v.email}</option>)}
      </select>
      {error && <p className="body-sm text-accent">{error}</p>}
      <button onClick={send} disabled={sending || !vendorId} className="btn-primary">{sending ? "Sending" : "Send Work Order"}</button>
    </div>
  );
}
