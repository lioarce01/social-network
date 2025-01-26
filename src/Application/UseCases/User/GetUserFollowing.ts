import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { inject, injectable } from "tsyringe";
import { FollowerDTO } from "../../DTOs/User";

@injectable()
export class GetUserFollowing {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(
    id: string,
    offset?: number,
    limit?: number,
  ): Promise<{ following: FollowerDTO[]; totalCount: number }> {
    const result = await this.userRepository.getUserFollowing(
      id,
      offset,
      limit,
    );

    return result;
  }
}
