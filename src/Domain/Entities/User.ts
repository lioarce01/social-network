import {
  Comment,
  JobApplication,
  JobPosting,
  Post,
  PostLike,
  Role,
} from "@prisma/client";
import { UserFollow } from "./UserFollow";

export class User {
  constructor(
    public readonly id: string,
    public readonly sub: string,
    public readonly name: string,
    public readonly email: string,
    public readonly profile_pic: string,
    public readonly enabled: boolean,
    public readonly role: Role,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly followingCount: number,
    public readonly followersCount: number,
    public readonly headline?: string,
    public readonly country?: string,
    public readonly postal_code?: string,
    public readonly city?: string,
    public readonly current_position?: string,
    public readonly posts?: Post[],
    public readonly comments?: Comment[],
    public readonly likedPosts?: PostLike[],
    public readonly jobPostings?: JobPosting[],
    public readonly applications?: JobApplication[],
    public readonly followers?: UserFollow[],
    public readonly following?: UserFollow[],
  ) {}
}
