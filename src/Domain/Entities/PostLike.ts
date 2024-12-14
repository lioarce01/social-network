import { User, Post } from "@prisma/client";

export class PostLike {
  constructor(
    public id: string,
    public userId: string,
    public postId: string,
    public createdAt: Date,
    public user?: User,
    public post?: Post,
  ) {}
}
