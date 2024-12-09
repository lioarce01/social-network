import { Post, User } from "@prisma/client";

export class Comment {
  constructor(
    public id: string,
    public content: string,
    public authorId: string,
    public author: User,
    public postId: string,
    public post: Post,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
