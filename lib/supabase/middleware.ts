import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic =
    path === "/login" ||
    path.startsWith("/setup-account") ||
    path.startsWith("/auth") ||
    path.startsWith("/apply") ||
    path.startsWith("/_next") ||
    path.startsWith("/api");

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, profile_completed")
      .eq("id", user.id)
      .single();

    if (profile && !profile.profile_completed && path !== "/setup-account" && !path.startsWith("/auth")) {
      const url = request.nextUrl.clone();
      url.pathname = "/setup-account";
      return NextResponse.redirect(url);
    }

    if (path === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = profile?.role === "admin" ? "/admin" : "/interview";
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/admin") && profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/interview";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
