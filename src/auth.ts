import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";

import { env } from "./env";
import { db } from "./server/db";

const getAuthBaseUrl = () => {
  const url = new URL(env.AUTH_URL);

  if (url.pathname === "/api/auth" || url.pathname === "/api/auth/") {
    url.pathname = "";
  }

  return url.toString().replace(/\/$/, "");
};

export const auth = betterAuth({
  appName: "Wireguard Manager",
  baseURL: getAuthBaseUrl(),
  database: prismaAdapter(db, {
    provider: "sqlite",
  }),
  secret: env.AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    },
  },
});
