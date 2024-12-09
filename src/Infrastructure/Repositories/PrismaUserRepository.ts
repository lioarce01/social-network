import { UserRepository } from "../../Domain/Repositories/UserRepository";
import { User } from "../../Domain/Entities/User";
import prisma from "../../config/config";
import { injectable } from "tsyringe";
import { Prisma, Role } from "@prisma/client";

@injectable()
export class PrismaUserRepository implements UserRepository {
  async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async updateUser(
    id: string,
    userData: { name?: string; email?: string },
  ): Promise<{ message: string; user: User }> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    return {
      message: "User updated successfully",
      user: updatedUser,
    };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    await prisma.user.delete({ where: { id } });

    return {
      message: "User deleted successfully",
    };
  }

  async createUser(
    userData: Prisma.UserCreateInput,
  ): Promise<{ message: string; user: User }> {
    const user = await prisma.user.create({ data: userData });

    const userEntity = new User(
      user.id,
      user.sub,
      user.name,
      user.email,
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

  async disableUser(id: string): Promise<{ message: string }> {
    await prisma.user.update({
      where: { id },
      data: { enabled: false },
    });

    return {
      message: "User disabled successfully",
    };
  }

  async switchUserRole(id: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const newRole = user.role === Role.ADMIN ? Role.USER : Role.ADMIN;

    await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });

    return {
      message: "Role switched successfully",
    };
  }

  async getAllUsers(offset?: number, limit?: number): Promise<User[] | null> {
    const users = await prisma.user.findMany({
      ...(typeof offset !== "undefined" && { skip: offset }),
      ...(typeof limit !== "undefined" && { take: limit }),
    });

    return users;
  }
}
