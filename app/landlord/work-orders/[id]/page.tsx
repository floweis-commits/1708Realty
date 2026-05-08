import { createClient } from "@/lib/supabase/server";
import StatusForm from "./StatusForm";
import { notFound } from "next/navigation";

export default async function WorkOrderDetail({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: order } = await supabase.from("work_orders").select("*").eq("id", params.id).single();
  if (!order) return notFound();

  return (
    <div className="space-y-12 max-w-3xl">
      <div className="label-md text-secondary">{order.category}</div>
      <h1 className="text-4xl text-ink font-medium tracking-tight">{order.title}</h1>
      {order.description && <div className="body-sm whitespace-pre-wrap">{order.description}</div>}
      {order.image_url && (
        <div className="shell p-4">
          <div className="label-md text-secondary mb-4">Photo</div>
          <img src={order.image_url} alt="work order" className="w-full max-h-96 object-cover" style={{borderRadius:0}} />
        </div>
      )}
      <div className="shell p-8 space-y-6">
        <div className="label-md text-secondary">Status</div>
        <StatusForm id={order.id} current={order.status} />
      </div>
      <div className="body-sm text-secondary">
        Submitted {new Date(order.created_at).toLocaleString()} · Updated {new Date(order.updated_at).toLocaleString()}
      </div>
    </div>
  );
}
