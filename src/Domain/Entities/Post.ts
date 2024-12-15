import { Comment, User } from "@prisma/client";
import { PostLike } from "./PostLike";

export class Post {
  constructor(
    public id: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date,
    public likeCount: number,
    public likes?: PostLike,
    public authorId?: string,
    public comments?: Comment[],
    public author?: User,
  ) {}
}
