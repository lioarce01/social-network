import { Comment, User } from "@prisma/client";

export class Post {
  constructor(
    public id: string,
    public content: string,
    public authorId: string,
    public author: User,
    public comments?: Comment[],
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
