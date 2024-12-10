import { withAuth } from "next-auth/middleware";
import { NextResponse, userAgent } from "next/server";
import { checkToken } from "./lib/apis/checkToken";

export default withAuth(
  async function middleware(req, token) {
    const userId: string | unknown = req.nextauth.token?.id;

    const check = await checkToken(userId);

    // if (
    //   !check &&
    //   !req.nextUrl.pathname.startsWith("/auth/") &&
    //   !req.nextUrl.pathname.startsWith("/refer/") &&
    //   req.nextUrl.pathname !== "/"
    // ) {
    //   return NextResponse.rewrite(new URL("/blocked", req.url));
    // }
  },

  {
    callbacks: {
      authorized: ({ req, token }) =>
        req.nextUrl.pathname === "/" ||
        req.nextUrl.pathname.startsWith("/auth/") ||
        req.nextUrl.pathname.startsWith("/refer/") ||
        req.nextUrl.pathname.startsWith("/documents") ||
        !!token,
    },

    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon|fonts|favicon.ico).*)",
  ],
};
