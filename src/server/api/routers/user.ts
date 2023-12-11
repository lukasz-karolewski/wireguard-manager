import { User } from "@prisma/client";
import "server-only";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

function mapUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    return users.map(mapUser);
  }),
});
