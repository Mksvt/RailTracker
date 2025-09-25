import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { fetchMeEdge } from "./lib/api"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const user = await fetchMeEdge(request)

    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
