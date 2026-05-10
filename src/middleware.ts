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

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  // Protect Admin Routes
  if (path.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(loginUrl);
    }

    // RBAC Check
    const primaryAdmin = "ridhorobbipasi@gmail.com";
    
    // 1. Bypass for Primary Admin
    if (user.email?.toLowerCase() === primaryAdmin.toLowerCase()) {
      return response;
    }

    // 2. Check Database for Role
    try {
      const { data: userData, error } = await supabase
        .from("User")
        .select("role")
        .eq("email", user.email)
        .maybeSingle();

      if (error || !userData || (userData.role !== "admin" && userData.role !== "editor")) {
        console.warn(`🚫 Unauthorized admin access attempt by ${user.email}`);
        // Redirect to home if not authorized
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (e) {
      console.error("🔒 RBAC Database Error:", e);
      // Fallback: If DB is down but user is authenticated, we might want to allow 
      // or deny. For security, we deny (redirect to home).
      return NextResponse.redirect(new URL("/", request.url));
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
     * - api routes that shouldn't be proxied
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
