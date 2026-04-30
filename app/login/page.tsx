"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    router.push(profile?.role === "landlord" ? "/landlord/dashboard" : "/tenant/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-8">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <div className="label-md mb-12 text-secondary">1708 — Realty / Login</div>
        <div className="space-y-8">
          <div>
            <label className="label-md text-secondary">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-underline" />
          </div>
          <div>
            <label className="label-md text-secondary">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-underline" />
          </div>
        </div>
        {error && <p className="mt-6 body-sm text-accent">{error}</p>}
        <button disabled={loading} className="btn-primary mt-12 w-full">{loading ? "Signing in" : "Sign in"}</button>
      </form>
    </main>
  );
}
