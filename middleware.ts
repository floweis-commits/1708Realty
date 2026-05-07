import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          ),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;
  const isProtected = path.startsWith("/tenant") || path.startsWith("/landlord");

  if (!user) {
    if (isProtected) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return res;
  }

  if (isProtected) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const role = profile?.role;
    if (role === "tenant" && path.startsWith("/landlord")) {
      const url = req.nextUrl.clone(); url.pathname = "/tenant/dashboard"; return NextResponse.redirect(url);
    }
    if (role === "landlord" && path.startsWith("/tenant")) {
      const url = req.nextUrl.clone(); url.pathname = "/landlord/dashboard"; return NextResponse.redirect(url);
    }
  }
  return res;
}

export const config = { matcher: ["/tenant/:path*", "/landlord/:path*"] };
