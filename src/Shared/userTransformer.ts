import { User } from "../Domain/Entities/User";
import { UserFollow } from "../Domain/Entities/UserFollow";

import { User as PrismaUser } from "@prisma/client";

export class UserTransformer
{
  static toDomain(
    user: PrismaUser,
    followers: any[] = [],
    following: any[] = [],
  ): User
  {
    return new User(
      user.id,
      user.sub,
      user.name ?? "",
      user.email,
      user.profile_pic,
      user.enabled,
      user.role,
      user.createdAt,
      user.updatedAt,
      user.followingCount,
      user.followersCount,
      user.headline ?? "",
      user.country ?? "",
      user.postal_code ?? "",
      user.city ?? "",
      user.current_position ?? "",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      followers.map((f) => UserTransformer.followToDomain(f)),
      following.map((f) => UserTransformer.followToDomain(f)),
    );
  }

  static followToDomain(follow: any): UserFollow
  {
    return new UserFollow(
      follow.id,
      follow.followerId,
      follow.followingId,
      follow.follower ? UserTransformer.toDomain(follow.follower) : undefined,
      follow.following ? UserTransformer.toDomain(follow.following) : undefined,
    );
  }
}
