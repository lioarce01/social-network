import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class UnfollowUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    followingId: string,
  ): Promise<{ message: string }> {
    const { message } = await this.userRepository.unfollowUser(
      userId,
      followingId,
    );

    return {
      message,
    };
  }
}
