"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function TopNav({ role, email }: { role: "tenant" | "landlord"; email?: string | null }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const base = role === "tenant" ? "/tenant" : "/landlord";

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-line">
      <div className="flex items-center gap-12">
        <Link href={`${base}/dashboard`} className="label-md text-ink">1708 — Realty</Link>
        <Link href={`${base}/dashboard`} className="label-md text-secondary hover:text-ink">Dashboard</Link>
        <Link href={`${base}/work-orders`} className="label-md text-secondary hover:text-ink">Work Orders</Link>
        {role === "tenant" && <Link href="/tenant/billing" className="label-md text-secondary hover:text-ink">Billing</Link>}
        {role === "landlord" && <Link href="/landlord/vendors" className="label-md text-secondary hover:text-ink">Vendors</Link>}
        {role === "landlord" && <Link href="/landlord/billing" className="label-md text-secondary hover:text-ink">Tenant Payments</Link>}
      </div>
      <div className="flex items-center gap-8">
        <span className="label-md text-secondary">{email}</span>
        <button onClick={signOut} className="btn-secondary">Sign out</button>
      </div>
    </nav>
  );
}
