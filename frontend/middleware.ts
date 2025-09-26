import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchMeEdge } from "./lib/api";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const user = await fetchMeEdge(request);

    if (user.role !== "admin") return NextResponse.redirect(new URL("/", request.url));

    return NextResponse.next(); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
