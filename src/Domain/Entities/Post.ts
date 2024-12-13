import { Comment, User } from "@prisma/client";

export class Post {
  constructor(
    public id: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date,
    public authorId?: string,
    public comments?: Comment[],
    public author?: User,
  ) {}
}
