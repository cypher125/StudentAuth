import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is a protected route
  const isAdminRoute = path.startsWith("/admin")
  const isProfileRoute = path.startsWith("/profile")
  const isPublicRoute =
    path === "/" || path === "/about" || path === "/contact" || path.startsWith("/login") || path === "/scan"

  // Get the authentication token from cookies
  const userCookie = request.cookies.get("user")?.value

  // If the route is protected and the user is not authenticated, redirect to login
  if ((isAdminRoute || isProfileRoute) && !userCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the route is an admin route, check if the user has admin role
  if (isAdminRoute && userCookie) {
    try {
      const userData = JSON.parse(userCookie)
      if (userData.role !== "admin") {
        return NextResponse.redirect(new URL("/login/admin", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login/admin", request.url))
    }
  }

  // If the user is authenticated and trying to access login page, redirect to appropriate dashboard
  if (path.startsWith("/login") && userCookie) {
    try {
      const userData = JSON.parse(userCookie)
      if (userData.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      } else {
        return NextResponse.redirect(new URL("/profile", request.url))
      }
    } catch (error) {
      // If there's an error parsing the user data, continue to the login page
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/login/:path*", "/profile", "/login"],
}

