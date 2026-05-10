import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
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

  // RBAC & Route Protection
  const path = request.nextUrl.pathname;

  // Protect Admin Routes
  if (path.startsWith("/admin")) {
    if (!user) {
      console.log("🚩 No user found, redirecting to /login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(loginUrl);
    }

    // Temporary: Allow primary admin directly via email string check
    // This is safer for initial setup when database sync might be delayed
    const primaryAdmin = "ridhorobbipasi@gmail.com";
    
    if (user.email?.toLowerCase() === primaryAdmin.toLowerCase()) {
      return response;
    }

    // Database check for other users
    try {
      const { data: userData, error } = await supabase
        .from("User")
        .select("role")
        .eq("email", user.email)
        .single();

      if (error || !userData || (userData.role !== "admin" && userData.role !== "editor")) {
        console.warn(`🚫 Unauthorized admin access attempt by ${user.email}`);
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (e) {
      console.error("🔒 RBAC Database Error:", e);
      // Fallback to home if database is unreachable
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
