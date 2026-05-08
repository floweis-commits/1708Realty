"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Plumbing","Electrical","HVAC / Heating / Cooling","Roof / Leak","Appliance","Pest Control","General Maintenance","Garage Door","Window","Fence","Mold","Power Washing","Rekeying","Other"];

type Vendor = { id: string; name: string; email: string | null; phone: string | null; categories: string[]; notes: string | null };

export default function VendorList({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleCat(c: string) {
    setSelected(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  async function save() {
    setSaving(true);
    await supabase.from("vendors").insert({ name, email: email || null, phone: phone || null, categories: selected, notes: notes || null });
    setSaving(false);
    setAdding(false); setName(""); setEmail(""); setPhone(""); setNotes(""); setSelected([]);
    router.refresh();
  }

  async function remove(id: string) {
    await supabase.from("vendors").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="shell">
        {vendors.length === 0 ? (
          <div className="p-12 body-sm text-secondary">No vendors yet.</div>
        ) : (
          <ul>
            {vendors.map(v => (
              <li key={v.id} className="flex items-start gap-8 px-8 py-6 border-b border-line last:border-0">
                <div className="flex-1">
                  <div className="text-ink">{v.name}</div>
                  <div className="body-sm text-secondary mt-1">
                    {v.phone && <span>{v.phone}</span>}
                    {v.phone && v.email && <span> · </span>}
                    {v.email && <span>{v.email}</span>}
                    {!v.phone && !v.email && <span className="italic">No contact info</span>}
                  </div>
                  {v.categories.length > 0 && <div className="flex gap-2 mt-2 flex-wrap">{v.categories.map(c => <span key={c} className="badge badge-closed">{c}</span>)}</div>}
                  {v.notes && <div className="body-sm text-secondary mt-2">{v.notes}</div>}
                </div>
                <button onClick={() => remove(v.id)} className="btn-secondary">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {adding ? (
        <div className="shell p-8 space-y-6">
          <div className="label-md text-secondary">New Vendor</div>
          <div className="space-y-6">
            <div><label className="label-md text-secondary">Name</label><input value={name} onChange={e=>setName(e.target.value)} className="input-underline" /></div>
            <div><label className="label-md text-secondary">Phone (optional)</label><input value={phone} onChange={e=>setPhone(e.target.value)} className="input-underline" /></div>
            <div><label className="label-md text-secondary">Email (optional)</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-underline" /></div>
            <div><label className="label-md text-secondary block mb-3">Categories</label><div className="flex flex-wrap gap-2">{CATEGORIES.map(c=>(<button type="button" key={c} onClick={()=>toggleCat(c)} className={`badge cursor-pointer ${selected.includes(c) ? "badge-progress" : "badge-closed"}`}>{c}</button>))}</div></div>
            <div><label className="label-md text-secondary">Notes (optional)</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} className="input-underline resize-none" /></div>
          </div>
          <div className="flex gap-4">
            <button onClick={save} disabled={!name || saving} className="btn-primary">{saving ? "Saving" : "Add Vendor"}</button>
            <button onClick={() => setAdding(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="btn-primary">Add Vendor</button>
      )}
    </div>
  );
}
