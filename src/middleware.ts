import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;
  console.log(path, token);
  if (path === "/" && token) {
    console.log("masuk");
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  if (path !== "/" && !token) {
    // Belum login, tapi ke /dashboard
    return NextResponse.redirect(new URL("/", request.url));
  }

  // return NextResponse.next();
}

export const config = {
  matcher: ["/", "/projects"],
};
