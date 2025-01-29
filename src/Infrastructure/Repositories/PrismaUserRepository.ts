import { UserRepository } from "../../Domain/Repositories/UserRepository";
import { User } from "../../Domain/Entities/User";
import { injectable } from "tsyringe";
import { Prisma, Role } from "@prisma/client";
import { UserFilter } from "../Filters/UserFilter";
import { FollowerDTO, UpdateUserDTO } from "../../Application/DTOs/User";
import { UserFollow } from "../../Domain/Entities/UserFollow";
import { CustomError } from "../../Shared/CustomError";
import { JobApplication } from "../../Domain/Entities/JobApplication";
import { JobPosting } from "../../Domain/Entities/JobPosting";
import { ExperienceLevel } from "../../types/JobPosting";
import { PostLike } from "../../Domain/Entities/PostLike";
import { BasePrismaRepository } from "./BasePrismaRepository";
import { userIncludes } from "../../Shared/userIncludes";
import { UserTransformer } from "../../Shared/userTransformer";

@injectable()
export class PrismaUserRepository
  extends BasePrismaRepository<User>
  implements UserRepository
{
  protected entityName = "user";

  async getUserBySub(sub: string): Promise<User> {
    const user = await this.getBySub(sub, userIncludes);

    return UserTransformer.toDomain(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.getById(id, userIncludes);
    return UserTransformer.toDomain(user, user.followers, user.followings);
  }

  async updateUser(
    id: string,
    userData: UpdateUserDTO,
  ): Promise<{ message: string; user: User }> {
    await this.getUserById(id);

    const updatedUser = await this.baseUpdate(
      id,
      {
        ...userData,
        headline: userData.headline ?? undefined,
        country: userData.country ?? undefined,
        postal_code: userData.postal_code ?? undefined,
        city: userData.city ?? undefined,
        current_position: userData.current_position ?? undefined,
        updatedAt: new Date(),
      },
      userIncludes,
    );

    return {
      message: "User updated successfully",
      user: UserTransformer.toDomain(updatedUser),
    };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    await this.baseDelete(id);
    return { message: "User deleted successfully" };
  }

  async createUser(
    userData: Prisma.UserCreateInput,
  ): Promise<{ message: string; user: User }> {
    try {
      const user = await this.prisma.user.create({ data: userData });

      const userEntity = UserTransformer.toDomain(user);

      return {
        message: "User created successfully",
        user: userEntity,
      };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("User already exists");
      }
      throw error;
    }
  }

  async disableUser(id: string): Promise<{ message: string; user: User }> {
    const user = await this.getById(id);

    const newStatus = this.getUserStatus(user.enabled);

    const updatedUser = await this.updateUserStatus(id, newStatus);

    const transformedUser = UserTransformer.toDomain(updatedUser);

    return {
      message: "User status changed successfully",
      user: transformedUser,
    };
  }

  async switchUserRole(id: string): Promise<{ message: string; user: User }> {
    const user = await this.getById(id);

    const newRole = this.getUserRole(user.role);

    const updatedUser = await this.updateUserRole(id, newRole);

    const transformedUser = UserTransformer.toDomain(updatedUser);

    return {
      message: "Role switched successfully",
      user: transformedUser,
    };
  }

  async getAllUsers(
    offset: number,
    limit: number,
    filter?: UserFilter,
  ): Promise<User[]> {
    const whereClause = filter?.buildWhereClause();

    const pagination = this.buildPagination(offset, limit);

    const users = await this.prisma.user.findMany({
      where: whereClause,
      ...pagination,
    });

    return users.map((user) => UserTransformer.toDomain(user));
  }

  async followUser(userId: string, followingId: string): Promise<UserFollow> {
    if (!userId || !followingId) {
      throw new CustomError("User ID and Following ID are required.", 400);
    }

    if (userId === followingId) {
      throw new CustomError("A user cannot follow themselves.", 400);
    }

    await this.getExistingFollow(userId, followingId);

    const users = await this.prisma.user.findMany({
      where: {
        id: { in: [userId, followingId] },
      },
      select: { id: true },
    });

    if (users.length !== 2) {
      throw new CustomError("One or both users do not exist.", 404);
    }

    const result = this.runTransaction(async (tx) => {
      const followRelation = await this.prisma.userFollow.create({
        data: {
          followerId: userId,
          followingId: followingId,
        },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: { followingCount: { increment: 1 } },
      });

      await this.prisma.user.update({
        where: { id: followingId },
        data: { followersCount: { increment: 1 } },
      });

      return followRelation;
    });

    return result;
  }

  async unfollowUser(
    userId: string,
    followingId: string,
  ): Promise<{ message: string }> {
    await this.getExistingFollow(userId, followingId);

    const { message } = await this.prisma.$transaction(async (prisma) => {
      await prisma.userFollow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: followingId,
          },
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { followingCount: { decrement: 1 } },
      });

      await prisma.user.update({
        where: { id: followingId },
        data: { followersCount: { decrement: 1 } },
      });

      return { message: "Unfollowed successfully." };
    });

    return {
      message,
    };
  }

  async getUserApplications(
    userId: string,
    offset: number,
    limit: number,
  ): Promise<{ jobApplications: JobApplication[]; totalCount: number }> {
    await this.getById(userId);

    const pagination = this.buildPagination(offset, limit);

    const userApplications = await this.prisma.jobApplication.findMany({
      where: {
        userId: userId,
      },
      ...pagination,
    });

    const totalCount = await this.prisma.jobApplication.count({
      where: {
        userId: userId,
      },
    });

    return {
      jobApplications: userApplications,
      totalCount: totalCount,
    };
  }

  async getUserJobPostings(
    id: string,
    offset: number,
    limit: number,
  ): Promise<{ jobPostings: JobPosting[]; totalCount: number }> {
    await this.getById(id);

    const pagination = this.buildPagination(offset, limit);

    const jobPostings = await this.prisma.jobPosting.findMany({
      where: {
        jobAuthorId: id,
      },
      ...pagination,
    });

    const jobs = jobPostings.map((job) => ({
      ...job,
      experience_level: job.experience_level as ExperienceLevel,
    }));

    const totalCount = await this.prisma.jobPosting.count({
      where: {
        jobAuthorId: id,
      },
    });

    return {
      jobPostings: jobs,
      totalCount: totalCount,
    };
  }

  async getUserLikedPosts(
    id: string,
    offset: number,
    limit: number,
  ): Promise<{ likedPosts: PostLike[]; totalCount: number }> {
    await this.getById(id);

    const pagination = this.buildPagination(offset, limit);

    const likedPosts = await this.prisma.postLike.findMany({
      where: {
        userId: id,
      },
      include: {
        post: true,
      },
      ...pagination,
    });

    const totalCount = await this.prisma.postLike.count({
      where: {
        userId: id,
      },
    });

    return {
      likedPosts,
      totalCount,
    };
  }

  async getUserFollowers(
    id: string,
    offset: number,
    limit: number,
  ): Promise<{ followers: FollowerDTO[]; totalCount: number }> {
    await this.getById(id);

    const pagination = this.buildPagination(offset, limit);

    const userFollowers = await this.prisma.userFollow.findMany({
      where: {
        followingId: id,
      },
      include: {
        follower: true,
      },
      ...pagination,
    });

    const totalCount = await this.prisma.userFollow.count({
      where: {
        followingId: id,
      },
    });

    const followers = userFollowers.map(
      (f) =>
        new FollowerDTO(
          f.follower.id,
          f.follower.name,
          f.follower.profile_pic,
          f.follower.headline ?? "",
        ),
    );

    return {
      followers,
      totalCount,
    };
  }

  async getUserFollowing(
    id: string,
    offset: number,
    limit: number,
  ): Promise<{ following: FollowerDTO[]; totalCount: number }> {
    await this.getById(id);

    const pagination = this.buildPagination(offset, limit);

    const userFollowing = await this.prisma.userFollow.findMany({
      where: {
        followerId: id,
      },
      include: {
        following: true,
      },
      ...pagination,
    });

    const totalCount = await this.prisma.userFollow.count({
      where: {
        followerId: id,
      },
    });

    const following = userFollowing.map(
      (f) =>
        new FollowerDTO(
          f.following.id,
          f.following.name,
          f.following.profile_pic,
          f.following.headline ?? "",
        ),
    );

    return {
      following,
      totalCount,
    };
  }

  // HELPER METHODS
  private getUserRole(nextRole: Role): Role {
    return nextRole === Role.ADMIN ? Role.USER : Role.ADMIN;
  }

  private getUserStatus(nextStatus: boolean) {
    return !nextStatus;
  }

  private async updateUserStatus(id: string, newStatus: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { enabled: newStatus },
    });
  }

  private async updateUserRole(id: string, newRole: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role: newRole },
    });
  }

  private async getExistingFollow(userId: string, followingId: string) {
    if (!userId || !followingId) {
      throw new CustomError("User ID and Following ID are required.", 400);
    }

    if (userId === followingId) {
      throw new CustomError("A user cannot unfollow themselves.", 400);
    }

    await this.getById(userId);
    await this.getById(followingId);

    const existingFollow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });

    if (existingFollow) {
      throw new CustomError(`You already are a follower.`, 400);
    }

    return existingFollow;
  }
}
