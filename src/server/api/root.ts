import { createTRPCRouter } from "~/server/api/trpc";

import { clientRouter } from "./routers/client";
import { settingsRouter } from "./routers/settings";
import { siteRouter } from "./routers/site";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  site: siteRouter,
  client: clientRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
