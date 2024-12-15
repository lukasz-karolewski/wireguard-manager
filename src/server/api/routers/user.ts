import "server-only";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();

    return users.map((user) => ({
      email: user.email,
      id: user.id,
      image: user.image,
      name: user.name,
    }));
  }),
});
