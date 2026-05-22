import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";

import { env } from "./env";
import { db } from "./server/db";

const getAuthBaseUrl = () => {
  const url = new URL(env.AUTH_URL ?? "http://localhost:3000");

  if (url.pathname === "/api/auth" || url.pathname === "/api/auth/") {
    url.pathname = "";
  }

  return url.toString().replace(/\/$/, "");
};

const getAuthSecret = () => {
  if (env.AUTH_SECRET) {
    return env.AUTH_SECRET;
  }

  if (process.env.SKIP_ENV_VALIDATION) {
    return "build-time-secret-for-static-analysis-only";
  }

  return undefined;
};

const getBuildTimeFallback = (value: string | undefined) => {
  if (value) {
    return value;
  }

  if (process.env.SKIP_ENV_VALIDATION) {
    return "build-time-placeholder";
  }

  return "";
};

export const auth = betterAuth({
  appName: "Wireguard Manager",
  baseURL: getAuthBaseUrl(),
  database: prismaAdapter(db, {
    provider: "sqlite",
  }),
  secret: getAuthSecret(),
  socialProviders: {
    google: {
      clientId: getBuildTimeFallback(env.GOOGLE_ID),
      clientSecret: getBuildTimeFallback(env.GOOGLE_SECRET),
    },
  },
});
