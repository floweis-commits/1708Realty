"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["Plumbing","Electrical","HVAC / Heating / Cooling","Roof / Leak","Appliance","Pest Control","General Maintenance","Other"];

export default function NewWorkOrder() {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in"); setLoading(false); return; }

    let image_url: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("work-orders").upload(path, file);
      if (uploadErr) { setError(uploadErr.message); setLoading(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("work-orders").getPublicUrl(path);
      image_url = publicUrl;
    }

    const { error: err } = await supabase.from("work_orders").insert({ tenant_id: user.id, title, description, category, image_url });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/tenant/work-orders");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-12">
      <h1 className="label-md text-secondary">New Work Order</h1>
      <div className="space-y-8">
        <div>
          <label className="label-md text-secondary">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-underline bg-transparent">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label-md text-secondary">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input-underline" />
        </div>
        <div>
          <label className="label-md text-secondary">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="input-underline resize-none" />
        </div>
        <div>
          <label className="label-md text-secondary block mb-3">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={onFileChange} className="body-sm text-secondary" />
          {preview && (
            <div className="mt-4">
              <img src={preview} alt="preview" className="max-h-48 object-cover" style={{borderRadius:0}} />
            </div>
          )}
        </div>
      </div>
      {error && <p className="body-sm text-accent">{error}</p>}
      <button disabled={loading} className="btn-primary">{loading ? "Submitting" : "Submit"}</button>
    </form>
  );
}
