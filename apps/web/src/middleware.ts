import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req, token) {},

  {
    callbacks: {
      authorized: ({ req, token }) =>
        req.nextUrl.pathname.startsWith("/auth/") || !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|fonts|favicon.ico).*)"],
};
