import { Prisma } from "@prisma/client";

export const userIncludes = {
  followers: {
    include: { follower: true },
  },
  following: {
    include: { following: true },
  },
} satisfies Prisma.UserInclude;
