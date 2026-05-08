import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));

  const service = createServiceClient();
  const { data: profile } = await service.from("profiles").select("role").eq("id", user.id).single();
  const dest = profile?.role === "landlord" ? "/landlord/dashboard" : "/tenant/dashboard";
  return NextResponse.redirect(new URL(dest, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
