import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accesstoken")?.value;
  const { pathname } = request.nextUrl;

  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up"],
};
