import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getUser() is more secure than getSession() but slower
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  // Protect Admin Routes
  if (path.startsWith("/admin")) {
    if (!user) {
      console.log("🚩 [Middleware] No user found for /admin, redirecting to /login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(loginUrl);
    }

    console.log(`👤 [Middleware] Auth user found: ${user.email}`);

    // RBAC Check
    const primaryAdmin = "ridhorobbipasi@gmail.com";
    
    // 1. Bypass for Primary Admin
    if (user.email?.toLowerCase() === primaryAdmin.toLowerCase()) {
      console.log("✅ [Middleware] Primary Admin detected, allowing access.");
      return response;
    }

    // 2. Check Database for Role
    try {
      console.log(`🔍 [Middleware] Checking DB role for ${user.email}`);
      const { data: userData, error } = await supabase
        .from("User")
        .select("role")
        .eq("email", user.email)
        .maybeSingle();

      if (error) {
         console.error("❌ [Middleware] Database error during RBAC check:", error);
         // Fallback to home but with error param
         return NextResponse.redirect(new URL("/login?error=db_error", request.url));
      }

      if (!userData || (userData.role !== "admin" && userData.role !== "editor")) {
        console.warn(`🚫 [Middleware] Unauthorized role for ${user.email}: ${userData?.role || 'no_user_record'}`);
        // Redirect to login with error message and the email found
        const errorUrl = new URL("/login", request.url);
        errorUrl.searchParams.set("error", "unauthorized");
        errorUrl.searchParams.set("email", user.email || "unknown");
        return NextResponse.redirect(errorUrl);
      }
      
      console.log(`✅ [Middleware] Access granted for role: ${userData.role}`);
    } catch (e) {
      console.error("🔒 [Middleware] RBAC Exception:", e);
      return NextResponse.redirect(new URL("/login?error=system_error", request.url));
    }
  }

  // Protect Client Portal Routes
  if (path.startsWith("/client")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images in public
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
