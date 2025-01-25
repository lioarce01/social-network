import { UserRepository } from "../../Domain/Repositories/UserRepository";
import { User } from "../../Domain/Entities/User";
import { prisma } from "../../config/config";
import { injectable } from "tsyringe";
import { Prisma, Role } from "@prisma/client";
import { UserFilter } from "../Filters/UserFilter";
import { UpdateUserDTO } from "../../Application/DTOs/User";
import { UserFollow } from "../../Domain/Entities/UserFollow";
import { CustomError } from "../../Shared/CustomError";
import { JobApplication } from "../../Domain/Entities/JobApplication";

@injectable()
export class PrismaUserRepository implements UserRepository {
  async getUserBySub(sub: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { sub: sub },
      include: {
        posts: true,
        comments: true,
        jobPostings: true,
        applications: true,
        followers: {
          include: {
            follower: true,
          },
        },
        following: {
          include: {
            following: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return this.transformUser(user);
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) {
      throw new Error("User ID is required.");
    }

    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        followers: {
          include: {
            follower: true,
          },
        },
        following: {
          include: {
            following: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return this.transformUser(user);
  }

  async updateUser(
    id: string,
    userData: UpdateUserDTO,
  ): Promise<{ message: string; user: User }> {
    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) {
      throw new Error("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...userData,
        headline: userData.headline ?? undefined,
        country: userData.country ?? undefined,
        postal_code: userData.postal_code ?? undefined,
        city: userData.city ?? undefined,
        current_position: userData.current_position ?? undefined,
        updatedAt: new Date(),
      },
      include: {
        posts: true,
        comments: true,
        jobPostings: true,
        applications: true,
      },
    });

    const transformedUser = this.transformUser(updatedUser);

    return {
      message: "User updated successfully",
      user: transformedUser,
    };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const userExist = await prisma.user.findUnique({ where: { id } });

    if (!userExist) {
      return { message: "User not found" };
    }

    await prisma.user.delete({ where: { id } });

    return {
      message: "User deleted successfully",
    };
  }

  async createUser(
    userData: Prisma.UserCreateInput,
  ): Promise<{ message: string; user: User }> {
    try {
      const user = await prisma.user.create({ data: userData });

      const userEntity = this.transformUser(user);

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

    if (!user) {
      throw new Error("User not found");
    }

    const newStatus = this.getUserStatus(user.enabled);

    const updatedUser = await this.updateUserStatus(id, newStatus);

    const transformedUser = this.transformUser(updatedUser);

    return {
      message: "User status changed successfully",
      user: transformedUser,
    };
  }

  async switchUserRole(id: string): Promise<{ message: string; user: User }> {
    const user = await this.getById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const newRole = this.getUserRole(user.role);

    const updatedUser = await this.updateUserRole(id, newRole);

    const transformedUser = this.transformUser(updatedUser);

    return {
      message: "Role switched successfully",
      user: transformedUser,
    };
  }

  async getAllUsers(
    filter?: UserFilter,
    offset?: number,
    limit?: number,
  ): Promise<User[] | null> {
    const whereClause = filter?.buildWhereClause();
    const users = await prisma.user.findMany({
      where: whereClause,
      ...(offset && { skip: offset }),
      ...(limit && { take: limit }),
    });

    if (!users) {
      return null;
    }

    return users.map((user) => this.transformUser(user));
  }

  async followUser(userId: string, followingId: string): Promise<UserFollow> {
    if (!userId || !followingId) {
      throw new CustomError("User ID and Following ID are required.", 400);
    }

    if (userId === followingId) {
      throw new CustomError("A user cannot follow themselves.", 400);
    }

    const users = await prisma.user.findMany({
      where: {
        id: { in: [userId, followingId] },
      },
      select: { id: true },
    });

    if (users.length !== 2) {
      throw new CustomError("One or both users do not exist.", 404);
    }

    const existingFollow = await prisma.userFollow.findUnique({
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

    // Transacción para mantener la consistencia de los datos
    const result = await prisma.$transaction(async (prisma) => {
      const followRelation = await prisma.userFollow.create({
        data: {
          followerId: userId,
          followingId: followingId,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { followingCount: { increment: 1 } },
      });

      await prisma.user.update({
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
    if (!userId || !followingId) {
      throw new CustomError("User ID and Following ID are required.", 400);
    }

    if (userId === followingId) {
      throw new CustomError("A user cannot unfollow themselves.", 400);
    }

    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });

    if (!existingFollow) {
      throw new CustomError(`You are not a follower of this user.`, 400);
    }

    const { message } = await prisma.$transaction(async (prisma) => {
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
  ): Promise<{ jobApplications: JobApplication[]; totalCount: number }> {
    const user = await this.getById(userId);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const userApplications = await prisma.jobApplication.findMany({
      where: {
        userId: userId,
      },
    });

    const totalCount = await prisma.jobApplication.count({
      where: {
        userId: userId,
      },
    });

    return {
      jobApplications: userApplications,
      totalCount: totalCount,
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
    return prisma.user.update({
      where: { id },
      data: { enabled: newStatus },
    });
  }

  private async updateUserRole(id: string, newRole: Role) {
    return prisma.user.update({
      where: { id },
      data: { role: newRole },
    });
  }

  private async getById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  private transformUser(user: any) {
    return new User(
      user.id,
      user.sub,
      user.name,
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
      user.posts ?? [],
      user.comments ?? [],
      [],
      user.jobPostings ?? [],
      user.applications ?? [],
      user.followers?.map(
        (f: any) =>
          new UserFollow(
            f.id,
            f.followerId,
            f.followingId,
            f.follower,
            undefined,
          ),
      ) ?? [],
      user.following?.map(
        (f: any) =>
          new UserFollow(
            f.id,
            f.followerId,
            f.followingId,
            undefined,
            f.following,
          ),
      ) ?? [],
    );
  }
}
