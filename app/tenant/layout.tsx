import TopNav from "@/components/TopNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="min-h-screen">
      <TopNav role="tenant" email={user.email} />
      <div className="px-8 py-12 max-w-[1120px] mx-auto">{children}</div>
    </div>
  );
}
