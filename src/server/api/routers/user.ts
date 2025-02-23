import "server-only";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      include: { Client: { select: { id: true } }, defaultSite: true },
    });

    return users.map((user) => ({
      clientCount: user.Client.length,
      defaultSite: user.defaultSite
        ? { id: user.defaultSite.id, name: user.defaultSite.name }
        : null,
      email: user.email,
      id: user.id,
      image: user.image,
      name: user.name,
    }));
  }),
});
