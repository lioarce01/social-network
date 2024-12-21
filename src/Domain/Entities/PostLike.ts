import { User, Post } from "@prisma/client";

export class PostLike {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly postId: string,
    public readonly createdAt: Date,
    public readonly user?: User,
    public readonly post?: Post,
  ) {}
}
