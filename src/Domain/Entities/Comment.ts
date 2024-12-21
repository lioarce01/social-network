import { Post, User } from "@prisma/client";

export class Comment {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly postId?: string,
    public readonly authorId?: string,
    public readonly author?: User,
    public readonly post?: Post,
  ) {}
}
