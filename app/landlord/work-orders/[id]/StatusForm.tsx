"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STATUSES = ["Submitted","In Progress","Vendor Chosen","Completed","Closed"];

export default function StatusForm({ id, current }: { id: string; current: string }) {
  const router = useRouter(); const supabase = createClient();
  const [status,setStatus]=useState(current); const [saving,setSaving]=useState(false);
  async function save(){ setSaving(true); await supabase.from("work_orders").update({ status }).eq("id", id); setSaving(false); router.refresh(); }
  return (
    <div className="flex items-center gap-8">
      <select value={status} onChange={(e)=>setStatus(e.target.value)} className="input-underline bg-transparent flex-1">{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>
      <button onClick={save} disabled={saving || status === current} className="btn-primary">{saving ? "Saving" : "Update"}</button>
    </div>
  );
}
