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
    public id: string,
    public sub: string,
    public name: string,
    public email: string,
    public profile_pic: string,
    public enabled: boolean,
    public role: Role,
    public createdAt: Date,
    public updatedAt: Date,
    public posts?: Post[],
    public comments?: Comment[],
    public likedPosts?: PostLike[],
    public jobPostings?: JobPosting[],
    public applications?: JobApplication[],
  ) {}
}
