import { clientRouter } from "~/server/api/routers/client";
import { settingsRouter } from "~/server/api/routers/settings";
import { siteRouter } from "~/server/api/routers/site";

import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  site: siteRouter,
  client: clientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
