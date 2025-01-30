import { Prisma } from "@prisma/client";

export const userIncludes = {
  followers: {
    include: { follower: true },
  },
  following: {
    include: { following: true },
  },
} satisfies Prisma.UserInclude;

export const postIncludes = {
  author: {
    select: {
      id: true,
      sub: true,
    },
  },
} satisfies Prisma.PostInclude;
