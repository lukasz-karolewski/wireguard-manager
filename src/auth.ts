import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { PrismaClient } from "~/generated/prisma/client";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    session: (params) => {
      // By default, only exposes a name, email, image. Need to add back the id at minimum.
      if ("user" in params) {
        params.session.user.id = params.user.id;
      }
      return params.session;
    },
  },
  // pages: {
  //   signIn: "/login",
  // },
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  trustHost: true,
});
