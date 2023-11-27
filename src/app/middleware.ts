// next tutorial
// import NextAuth from "next-auth";
// import { authConfig } from "~/auth.config";
// export default NextAuth(authConfig).auth;

// export const { auth: middleware } = NextAuth(authConfig)

export { auth as middleware } from "~/auth";

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|_next/image|.png).*)"],
};
