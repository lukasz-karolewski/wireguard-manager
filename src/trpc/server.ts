import "server-only";
import { createTRPCClient, loggerLink, TRPCClientError } from "@trpc/client";
import { callTRPCProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { type TRPCErrorResponse } from "@trpc/server/rpc";
import { cookies } from "next/headers";
import { cache } from "react";

import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  return createTRPCContext({
    headers: new Headers({
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      cookie: cookies().toString(),
      "x-trpc-source": "rsc",
    }),
  });
});

export const api = createTRPCClient<typeof appRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    /**
     * Custom RSC link that lets us invoke procedures without using http requests. Since Server
     * Components always run on the server, we can just call the procedure as a function.
     */
    () =>
      // eslint-disable-next-line unicorn/consistent-function-scoping
      ({ op }) =>
        observable((observer) => {
          createContext()
            .then((ctx) => {
              return callTRPCProcedure({
                ctx,
                getRawInput: async () => await op.input,
                path: op.path,
                procedures: appRouter._def.procedures,
                signal: undefined, //TODO check what is this about
                type: op.type,
              });
            })
            .then((data) => {
              observer.next({ result: { data } });
              observer.complete();
            })
            // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
            .catch((error: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(error));
            });
        }),
  ],
});
