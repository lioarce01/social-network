import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { UserFollow } from "../../../Domain/Entities/UserFollow";
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../Shared/CustomError";

@injectable()
export class FollowUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, followingId: string): Promise<UserFollow> {
    const result = await this.userRepository.followUser(userId, followingId);

    return result;
  }
}
