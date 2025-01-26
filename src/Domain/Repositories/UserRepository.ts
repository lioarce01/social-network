import { Prisma } from "@prisma/client";
import { User } from "../Entities/User";
import { UserFilter } from "../../Infrastructure/Filters/UserFilter";
import { FollowerDTO, UpdateUserDTO } from "../../Application/DTOs/User";
import { UserFollow } from "../Entities/UserFollow";
import { JobApplication } from "../Entities/JobApplication";
import { JobPosting } from "../Entities/JobPosting";
import { PostLike } from "../Entities/PostLike";

export interface UserRepository {
  getAllUsers(
    filter?: UserFilter,
    offset?: number,
    limit?: number,
  ): Promise<User[] | null>;
  getUserBySub(sub: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(
    id: string,
    userData: UpdateUserDTO,
  ): Promise<{ message: string; user: User }>;
  deleteUser(id: string): Promise<{ message: string }>;
  createUser(
    userData: Prisma.UserCreateInput,
  ): Promise<{ message: string; user: User }>;
  disableUser(id: string): Promise<{ message: string; user: User }>;
  switchUserRole(id: string): Promise<{ message: string; user: User }>;
  followUser(userId: string, followingId: string): Promise<UserFollow>;
  unfollowUser(
    userId: string,
    followingId: string,
  ): Promise<{ message: string }>;
  getUserApplications(
    id: string,
    offset?: number,
    limit?: number,
  ): Promise<{ jobApplications: JobApplication[]; totalCount: number }>;
  getUserJobPostings(
    id: string,
    offset?: number,
    limit?: number,
  ): Promise<{ jobPostings: JobPosting[]; totalCount: number }>;
  getUserLikedPosts(
    id: string,
    offset?: number,
    limit?: number,
  ): Promise<{ likedPosts: PostLike[]; totalCount: number }>;
  getUserFollowers(
    id: string,
    offset?: number,
    limit?: number,
  ): Promise<{ followers: FollowerDTO[]; totalCount: number }>;
  getUserFollowing(
    id: string,
    offset?: number,
    limit?: number,
  ): Promise<{ following: FollowerDTO[]; totalCount: number }>;
}
