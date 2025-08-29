import { createTRPCClient, loggerLink, unstable_localLink } from "@trpc/client";
import { cookies } from "next/headers";
import "server-only";

import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

import { transformer } from "./shared";
/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */

export const api = createTRPCClient<typeof appRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
    }),
    /**
     * Custom RSC link that lets us invoke procedures without using http requests. Since Server
     * Components always run on the server, we can just call the procedure as a function.
     */
    unstable_localLink({
      createContext: async () => {
        const cookiesList = await cookies();
        return createTRPCContext({
          headers: new Headers({ cookie: cookiesList.toString(), "x-trpc-source": "rsc" }),
        });
      },
      router: appRouter,
      transformer,
    }),
  ],
});
