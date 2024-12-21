import {
  Comment,
  JobApplication,
  JobPosting,
  Post,
  PostLike,
  Role,
} from "@prisma/client";

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
    public readonly posts?: Post[],
    public readonly comments?: Comment[],
    public readonly likedPosts?: PostLike[],
    public readonly jobPostings?: JobPosting[],
    public readonly applications?: JobApplication[],
  ) {}
}
