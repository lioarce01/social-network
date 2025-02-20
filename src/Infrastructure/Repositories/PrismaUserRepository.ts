import { UserRepository } from "../../Domain/Repositories/UserRepository";
import { User } from "../../Domain/Entities/User";
import { injectable } from "tsyringe";
import { Prisma, Role } from "@prisma/client";
import { UserFilter } from "../Filters/UserFilter";
import
{
  CreateUserDTO,
  FollowerDTO,
  UpdateUserDTO,
} from "../../Application/DTOs/User";
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


  async getMe(sub: string): Promise<User | null>
  {
    const user = await this.prisma.user.findUnique({ where: { sub: sub } })

    if (!user) {
      throw new CustomError("User does not exist", 404)
    }

    return UserTransformer.toDomain(user);
  }
  async getUserBySub(sub: string): Promise<User>
  {
    const user = await this.getBySub(sub, userIncludes);

    return UserTransformer.toDomain(user);
  }

  async getUserById(id: string): Promise<User>
  {
    const user = await this.getById(id, userIncludes);
    return UserTransformer.toDomain(user, user.followers, user.followings);
  }

  async updateUser(
    authUserId: string,
    targetUserId: string,
    userData: UpdateUserDTO,
  ): Promise<{ message: string; user: User }>
  {
    if (!targetUserId) {
      throw new CustomError("User ID is required", 400);
    }

    const authUser = await this.getBySub(authUserId);
    const targetUser = await this.getById(targetUserId);

    if (authUser.role !== "ADMIN" && authUser.id !== targetUser.id) {
      throw new CustomError("You are not authorized to update this user", 403);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: targetUser?.id },
      data: {
        ...userData,
        headline: userData.headline ?? undefined,
        country: userData.country ?? undefined,
        postal_code: userData.postal_code ?? undefined,
        city: userData.city ?? undefined,
        current_position: userData.current_position ?? undefined,
        updatedAt: new Date(),
      }
    })

    return {
      message: "User updated successfully",
      user: UserTransformer.toDomain(updatedUser),
    };
  }

  async deleteUser(targetId: string): Promise<{ message: string }>
  {
    const target = await this.getBySub(targetId);
    if (!target) throw new Error("User not found");

    // Obtener IDs de usuarios relacionados
    const followers = await this.prisma.userFollow.findMany({
      where: { followingId: target.id },
      select: { followerId: true },
    });

    const following = await this.prisma.userFollow.findMany({
      where: { followerId: target.id },
      select: { followingId: true },
    });

    await this.prisma.$transaction([
      // Actualizar `followersCount` de los usuarios que seguían al usuario eliminado
      ...followers.map(({ followerId }) =>
        this.prisma.user.update({
          where: { id: followerId },
          data: { followingCount: { decrement: 1 } },
        })
      ),

      // Actualizar `followingCount` de los usuarios que eran seguidos por el usuario eliminado
      ...following.map(({ followingId }) =>
        this.prisma.user.update({
          where: { id: followingId },
          data: { followersCount: { decrement: 1 } },
        })
      ),

      // Eliminar las relaciones en `UserFollow`
      this.prisma.userFollow.deleteMany({
        where: {
          OR: [{ followerId: target.id }, { followingId: target.id }],
        },
      }),

      // Finalmente, eliminar al usuario
      this.prisma.user.delete({
        where: { id: target.id },
      }),
    ]);

    return { message: "User deleted successfully" };
  }

  async createUser(
    userData: CreateUserDTO,
  ): Promise<{ message: string; user: User }>
  {

    const user = await this.prisma.user.upsert({
      where: { sub: userData.sub },
      update: {
        email: userData.email,
        profile_pic: userData.profile_pic
      },
      create: {
        sub: userData.sub,
        email: userData.email,
        profile_pic: userData.profile_pic,
        name: userData.name ?? ""
      }
    })

    const userEntity = UserTransformer.toDomain(user);

    return {
      message: "User created successfully",
      user: userEntity,
    };
  }

  async disableUser(id: string, adminId: string): Promise<{ message: string }>
  {
    if (!id) {
      throw new CustomError("User ID is required", 400);
    }

    if (!adminId) {
      throw new CustomError("Admin ID is required", 400);
    }

    const admin = await this.getBySub(adminId);
    const user = await this.getById(id);

    if (admin.role !== "ADMIN") {
      throw new CustomError("Only admins can disable users", 403);
    }

    const newStatus = this.getUserStatus(user.enabled);

    this.updateUserStatus(id, newStatus);

    return {
      message: `User status changed to: ${newStatus}`,
    };
  }

  async switchUserRole(
    id: string,
    adminId: string,
  ): Promise<{ message: string }>
  {
    if (!id) {
      throw new CustomError("User ID is required", 400);
    }

    if (!adminId) {
      throw new CustomError("Admin ID is required", 400);
    }

    const admin = await this.getBySub(adminId);
    const user = await this.getById(id);

    if (admin.role !== "ADMIN") {
      throw new CustomError("Only admins can switch user roles", 403);
    }

    const newRole = this.getUserRole(user.role);

    await this.updateUserRole(id, newRole);

    return {
      message: `Role switched successfully to: ${newRole}`,
    };
  }

  async getAllUsers(
    offset: number,
    limit: number,
    filter?: UserFilter,
  ): Promise<User[]>
  {
    const whereClause = filter?.buildWhereClause();

    const pagination = this.buildPagination(offset, limit);

    const users = await this.prisma.user.findMany({
      where: whereClause,
      ...pagination,
    });

    return users.map((user) => UserTransformer.toDomain(user));
  }

  async followUser(userId: string, followingId: string): Promise<UserFollow>
  {
    const follower = await this.getBySub(userId);

    if (follower.id === followingId) {
      throw new CustomError("A user cannot follow themselves.", 400);
    }

    const existingFollow = await this.getExistingFollow(
      follower.id,
      followingId,
    );

    if (existingFollow) {
      throw new CustomError("User is already following this user.", 400);
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: { in: [(userId = follower.id), followingId] },
      },
      select: { id: true },
    });

    if (users.length !== 2) {
      throw new CustomError("One or both users do not exist.", 404);
    }

    const result = await this.runTransaction(async (tx) =>
    {
      const followRelation = await tx.userFollow.create({
        data: {
          followerId: follower.id,
          followingId: followingId,
        },
      });

      await tx.user.update({
        where: { id: follower.id },
        data: { followingCount: { increment: 1 } },
      });

      await tx.user.update({
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
  ): Promise<{ message: string }>
  {
    const follower = await this.getBySub(userId);

    if (follower.id === followingId) {
      throw new CustomError("A user cannot unfollow themselves.", 400);
    }

    const existingFollow = await this.getExistingFollow(
      follower.id,
      followingId,
    );

    if (!existingFollow) {
      throw new CustomError("You are not following this user.", 404);
    }

    const { message } = await this.runTransaction(async (tx) =>
    {
      await tx.userFollow.delete({
        where: {
          followerId_followingId: {
            followerId: follower.id,
            followingId: followingId,
          },
        },
      });

      await tx.user.update({
        where: { id: follower.id },
        data: { followingCount: { decrement: 1 } },
      });

      await tx.user.update({
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
  ): Promise<{ jobApplications: JobApplication[]; totalCount: number }>
  {
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
  ): Promise<{ jobPostings: JobPosting[]; totalCount: number }>
  {
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
  ): Promise<{ likedPosts: PostLike[]; totalCount: number }>
  {
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
  ): Promise<{ followers: FollowerDTO[]; totalCount: number }>
  {
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
          f.follower.name ?? "",
          f.follower.profile_pic ?? "",
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
  ): Promise<{ following: FollowerDTO[]; totalCount: number }>
  {
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
          f.following.name ?? "",
          f.following.profile_pic ?? "",
          f.following.headline ?? "",
        ),
    );

    return {
      following,
      totalCount,
    };
  }

  // HELPER METHODS
  private getUserRole(nextRole: Role): Role
  {
    return nextRole === Role.ADMIN ? Role.USER : Role.ADMIN;
  }

  private getUserStatus(nextStatus: boolean)
  {
    return !nextStatus;
  }

  private async updateUserStatus(id: string, newStatus: boolean)
  {
    return this.prisma.user.update({
      where: { id },
      data: { enabled: newStatus },
    });
  }

  private async updateUserRole(id: string, newRole: Role)
  {
    return this.prisma.user.update({
      where: { id },
      data: { role: newRole },
    });
  }

  private async getExistingFollow(userId: string, followingId: string)
  {
    if (!followingId) {
      throw new CustomError("Following ID is required.", 400);
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

    return existingFollow;
  }
}
