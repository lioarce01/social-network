import { User } from "@prisma/client";

export interface UserRepository {
  getAllUsers(offset?: number, limit?: number): Promise<User[] | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(userData: Partial<User>): Promise<User | null>;
  deleteUser(id: String): Promise<void>;
  createUser(userData: Partial<User>): Promise<User | null>;
  disableUser(id: String): Promise<void>;
  switchUserRole(id: String): Promise<void>
}
