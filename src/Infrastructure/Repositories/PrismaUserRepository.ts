import { UserRepository } from "../../Domain/Repositories/UserRepository";
import { User } from "../../Domain/Entities/User";
import { prisma } from "../../config/config";
import { injectable } from "tsyringe";
import { Prisma, Role } from "@prisma/client";
import { UserFilter } from "../Filters/UserFilter";

@injectable()
export class PrismaUserRepository implements UserRepository {
  async getUserById(sub: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { sub },
      include: {
        posts: true,
        comments: true,
        jobPostings: true,
        applications: true,
      },
    });
  }

  async updateUser(
    id: string,
    userData: { name?: string },
  ): Promise<{ message: string; user: User }> {
    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) {
      throw new Error("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...userData,
        updatedAt: new Date(),
      },
    });

    return {
      message: "User updated successfully",
      user: updatedUser,
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
    const userExist = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (userExist) {
      throw new Error("User already exists");
    }

    const user = await prisma.user.create({ data: userData });

    const userEntity = new User(
      user.id,
      user.sub,
      user.name,
      user.email,
      user.profile_pic,
      user.enabled,
      user.role,
      user.createdAt,
      user.updatedAt,
    );

    return {
      message: "User created successfully",
      user: userEntity,
    };
  }

  async disableUser(id: string): Promise<{ message: string; user: User }> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { enabled: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const changeStatus = user.enabled === true ? false : true;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { enabled: changeStatus },
    });

    return {
      message: "User status changed successfully",
      user: updatedUser,
    };
  }

  async switchUserRole(id: string): Promise<{ message: string; user: User }> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const newRole = user.role === Role.ADMIN ? Role.USER : Role.ADMIN;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });

    return {
      message: "Role switched successfully",
      user: updatedUser,
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
      ...(typeof offset !== "undefined" && { skip: offset }),
      ...(typeof limit !== "undefined" && { take: limit }),
    });

    return users;
  }
}
