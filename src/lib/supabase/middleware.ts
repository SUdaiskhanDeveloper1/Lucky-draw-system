import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";

/**
 * Refreshes the Supabase session on every request and guards protected routes.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const protectedPrefixes = [
    "/dashboard",
    "/profile",
    "/tickets",
    "/payments",
    "/notifications",
    "/referrals",
    "/join",
    "/admin",
  ];
  const isProtected = protectedPrefixes.some((p) => path.startsWith(p));

  // Not logged in trying to reach a protected page -> login
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Admin route guard
  if (path.startsWith("/admin") && user) {
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (!admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Logged in trying to reach auth pages -> dashboard
  if (user && ["/login", "/signup"].includes(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
