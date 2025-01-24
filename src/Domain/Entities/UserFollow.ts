import { User } from "./User";

export class UserFollow {
  constructor(
    public readonly id: string,
    public readonly followerId: string,
    public readonly followingId: string,
    public readonly follower?: User,
    public readonly following?: User,
  ) {}
}
