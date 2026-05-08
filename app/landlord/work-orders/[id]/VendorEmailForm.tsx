"use client";
import { useState } from "react";

type Vendor = { id: string; name: string; email: string | null; phone: string | null; categories: string[] };
type Order = { id: string; title: string; description: string | null; category: string; image_url: string | null };

function buildSms(vendor: Vendor, order: Order) {
  const body = [
    `Hi ${vendor.name}, this is 1708 Realty.`,
    `We have a ${order.category} issue: ${order.title}.`,
    order.description ? order.description : null,
    `Are you available to come take a look? Please reply with your availability.`,
  ].filter(Boolean).join(" ");
  const phone = vendor.phone?.replace(/\D/g, "") ?? "";
  return `sms:${phone}?body=${encodeURIComponent(body)}`;
}

export default function VendorEmailForm({ order, vendors }: { order: Order; vendors: Vendor[] }) {
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vendor = vendors.find(v => v.id === vendorId);

  async function sendEmail() {
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

  if (vendors.length === 0) return (
    <div className="body-sm text-secondary">No vendors match this category. <a href="/landlord/vendors" className="underline">Add vendors</a></div>
  );

  if (sent) return <div className="body-sm text-ink">Email sent to {vendor?.name}.</div>;

  return (
    <div className="space-y-6">
      <select value={vendorId} onChange={e => setVendorId(e.target.value)} className="input-underline bg-transparent">
        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}{v.phone ? ` — ${v.phone}` : ""}</option>)}
      </select>
      {vendor?.phone && (
        <div className="body-sm text-secondary">{vendor.phone}</div>
      )}
      {error && <p className="body-sm text-accent">{error}</p>}
      <div className="flex gap-4 flex-wrap">
        {vendor?.phone && (
          <a href={buildSms(vendor, order)} className="btn-primary" style={{textDecoration:"none"}}>Text Vendor</a>
        )}
        {vendor?.email && (
          <button onClick={sendEmail} disabled={sending} className="btn-secondary">{sending ? "Sending" : "Email Work Order"}</button>
        )}
        {!vendor?.email && !vendor?.phone && (
          <div className="body-sm text-secondary">No contact info for this vendor.</div>
        )}
      </div>
    </div>
  );
}
