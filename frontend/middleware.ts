import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchMeEdge } from "./lib/api";

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
