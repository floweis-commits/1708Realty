"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function TopNav({ role, email }: { role: "tenant" | "landlord"; email?: string | null }) {
  const router = useRouter();
  const supabase = createClient();
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
        <Link href={`${base}/billing`} className="label-md text-secondary hover:text-ink">Billing</Link>
      </div>
      <div className="flex items-center gap-8">
        <span className="label-md text-secondary">{email}</span>
        <button onClick={signOut} className="btn-secondary">Sign out</button>
      </div>
    </nav>
  );
}
