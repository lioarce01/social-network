import { UserRepository } from "../../Domain/Repositories/UserRepository";
import { User } from "../../Domain/Entities/User";
import { prisma } from "../../config/config";
import { injectable } from "tsyringe";
import { Prisma, Role } from "@prisma/client";
import { UserFilter } from "../Filters/UserFilter";
import { UpdateUserDTO } from "../../Application/DTOs/User";

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
      },
    });

    const transformedUser = this.transformUser(user);

    if (user) {
      return transformedUser;
    }

    return null;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        posts: true,
        comments: true,
        jobPostings: true,
        applications: true,
      },
    });

    const transformedUser = this.transformUser(user);

    if (user) {
      return transformedUser;
    }

    return null;
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
    );
  }
}
