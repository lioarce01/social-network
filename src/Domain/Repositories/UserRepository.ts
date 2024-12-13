import { Prisma } from "@prisma/client";
import { User } from "../Entities/User";

export interface UserRepository {
  getAllUsers(offset?: number, limit?: number): Promise<User[] | null>;
  getUserById(sub: string): Promise<User | null>;
  updateUser(
    id: string,
    userData: Partial<User>,
  ): Promise<{ message: string; user: User }>;
  deleteUser(id: String): Promise<{ message: string }>;
  createUser(
    userData: Prisma.UserCreateInput,
  ): Promise<{ message: string; user: User }>;
  disableUser(id: String): Promise<{ message: string; user: User }>;
  switchUserRole(id: String): Promise<{ message: string; user: User }>;
}
