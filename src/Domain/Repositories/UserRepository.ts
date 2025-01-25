import { Prisma } from "@prisma/client";
import { User } from "../Entities/User";
import { UserFilter } from "../../Infrastructure/Filters/UserFilter";
import { UpdateUserDTO } from "../../Application/DTOs/User";
import { UserFollow } from "../Entities/UserFollow";

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
}
