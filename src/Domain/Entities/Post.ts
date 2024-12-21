import { Comment, User } from "@prisma/client";
import { PostLike } from "./PostLike";

export class Post {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly likeCount: number,
    public readonly likes?: PostLike,
    public readonly authorId?: string,
    public readonly comments?: Comment[],
    public readonly author?: User,
  ) {}
}
