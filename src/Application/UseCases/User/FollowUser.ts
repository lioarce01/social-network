import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { UserFollow } from "../../../Domain/Entities/UserFollow";
import { inject, injectable } from "tsyringe";

@injectable()
export class FollowUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: String, followingId: String): Promise<UserFollow> {
    const result = await this.userRepository.followUser(userId, followingId);

    return result;
  }
}
