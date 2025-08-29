import "server-only";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      include: {
        Client: true,
        defaultSite: true,
        ownedClients: true,
      },
    });

    return users.map((user) => {
      return {
        clientCount: user.Client.length, // Clients created by user
        defaultSite: user.defaultSite ? { id: user.defaultSite.id, name: user.defaultSite.name } : null,
        deviceCount: user.ownedClients.length, // Devices (clients) owned by user
        email: user.email,
        id: user.id,
        image: user.image,
        name: user.name,
      };
    });
  }),
});
