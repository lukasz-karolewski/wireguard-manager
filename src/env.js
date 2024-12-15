import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtime (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */

  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,

    AUTH_URL: process.env.AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,

    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    VERSION: process.env.VERSION,
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET: process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),

    AUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set AUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),

    // Add ` on ID and SECRET if you want to make sure they're not empty
    GOOGLE_ID: z.string(),
    GOOGLE_SECRET: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    VERSION: z.string().optional(),
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
