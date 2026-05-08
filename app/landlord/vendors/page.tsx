import { createClient } from "@/lib/supabase/server";
import VendorList from "./VendorList";

export default async function VendorsPage() {
  const supabase = createClient();
  const { data: vendors } = await supabase.from("vendors").select("*").order("name");
  return (
    <div className="space-y-12">
      <h1 className="label-md text-secondary">Vendors</h1>
      <VendorList vendors={vendors ?? []} />
    </div>
  );
}
