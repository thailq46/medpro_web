import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api-next/auth/logout")) {
    return NextResponse.rewrite(new URL("/api/auth/logout", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/api-next/auth")) {
    return NextResponse.rewrite(new URL("/api/auth", request.url));
  }
  return NextResponse.next();
}
