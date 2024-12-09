import { Prisma, User } from "@prisma/client";

export interface UserRepository {
  getAllUsers(offset?: number, limit?: number): Promise<User[] | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(
    id: string,
    userData: Partial<User>,
  ): Promise<{ message: string; user: User }>;
  deleteUser(id: String): Promise<{ message: string }>;
  createUser(
    userData: Prisma.UserCreateInput,
  ): Promise<{ message: string; user: User }>;
  disableUser(id: String): Promise<{ message: string }>;
  switchUserRole(id: String): Promise<{ message: string }>;
}
