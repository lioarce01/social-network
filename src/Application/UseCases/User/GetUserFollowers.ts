import { User } from "../../../Domain/Entities/User";
import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { inject, injectable } from "tsyringe";
import { FollowerDTO } from "../../DTOs/User";

@injectable()
export class GetUserFollowers {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(
    id: string,
    offset?: number,
    limit?: number,
  ): Promise<{ followers: FollowerDTO[]; totalCount: number }> {
    const result = await this.userRepository.getUserFollowers(
      id,
      offset,
      limit,
    );

    return result;
  }
}
