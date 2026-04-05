import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Validate that a redirect path is internal only (prevent open redirect)
function isValidRedirect(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}

export async function middleware(request: NextRequest) {
  // If an OAuth code lands on a non-callback page, redirect to /auth/callback
  // Only for page routes (not API routes) as a safety net
  const code = request.nextUrl.searchParams.get("code");
  if (
    code &&
    request.nextUrl.pathname !== "/auth/callback" &&
    !request.nextUrl.pathname.startsWith("/api/")
  ) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip Supabase auth if env vars are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
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

    // Redirect authenticated users away from login/signup
    if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
      const url = request.nextUrl.clone();
      // If a valid internal redirect was requested, honor it; else go to /roleplay
      const requestedRedirect = request.nextUrl.searchParams.get("redirect");
      url.pathname = requestedRedirect && isValidRedirect(requestedRedirect) ? requestedRedirect : "/roleplay";
      // Strip error/auth/redirect params — user is already authenticated
      url.searchParams.delete("error");
      url.searchParams.delete("code");
      url.searchParams.delete("redirect");
      return NextResponse.redirect(url);
    }

    // Protect authenticated-only routes — redirect to login if not signed in
    const protectedPaths = ["/dashboard", "/referral", "/settings", "/insights"];
    if (!user && protectedPaths.some((p) => request.nextUrl.pathname === p)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      // request.nextUrl.pathname is server-derived so always internal, but validate for defense-in-depth
      const target = request.nextUrl.pathname;
      url.searchParams.set("redirect", isValidRedirect(target) ? target : "/roleplay");
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch {
    // If middleware fails, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
