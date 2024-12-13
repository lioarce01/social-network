import { Post, User } from "@prisma/client";

export class Comment {
  constructor(
    public id: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date,
    public postId?: string,
    public authorId?: string,
    public author?: User,
    public post?: Post,
  ) {}
}
